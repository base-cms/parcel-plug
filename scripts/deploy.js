#!/usr/bin/env node
const { existsSync } = require('fs');
const { join } = require('path');
const { spawnSync } = require('child_process');
const https = require('https'); // eslint-disable-line import/newline-after-import
const { DOCKER_USERNAME, DOCKER_PASSWORD, TRAVIS_TAG } = process.env;
const failed = () => spawnSync('npx', ['npx', '@base-cms/website-deployment-tool', 'notify-failed'], { stdio: 'inherit' });

const useLerna = existsSync(join(process.cwd(), 'lerna.json'));
// eslint-disable-next-line import/no-dynamic-require
const lerna = useLerna ? require(join(process.cwd(), 'lerna.json')) : { version: TRAVIS_TAG };
const { log } = console;

const version = `v${lerna.version}`;

const error = async (message) => {
  log(`ERROR: ${message}`);
  await failed();
  process.exit(1);
};

const getJson = (url, reqHeaders) => new Promise((resolve, reject) => {
  const headers = { ...reqHeaders, 'Content-Type': 'application/json; charset=utf-8' };
  https.get(url, { headers }, (resp) => {
    let data = '';
    const { statusCode, statusMessage } = resp;
    if (statusCode >= 500) return reject(statusMessage);
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => resolve(JSON.parse(data)));
    return resp;
  }).on('error', reject);
});

const getVersions = async (image) => {
  const authUrl = `https://auth.docker.io/token?service=registry.docker.io&scope=repository:${image}:pull`;
  const { token } = await getJson(authUrl);
  const url = `https://registry.hub.docker.com/v2/${image}/tags/list`;
  const list = await getJson(url, { Authorization: `Bearer ${token}` });
  return Array.isArray(list.tags) ? list.tags : [];
};

const shouldBuild = async (image) => {
  log(`\nChecking  ${image}:${version} on DockerHub`);
  const versions = await getVersions(image);
  return !versions.includes(version);
};

const { argv } = process;
const service = argv[2];
if (!service) throw new Error('Service argument is required!');
const servicePath = join('services', service);

if (TRAVIS_TAG !== version) error(`Tagged version ${TRAVIS_TAG} differs from lerna version ${version}, aborting!`);
if (!service) error('You must specify the service folder to deploy.');
if (!existsSync(servicePath)) error(`Could not read ${servicePath}!`);

// eslint-disable-next-line import/no-dynamic-require, global-require
const pkg = require(`../${servicePath}/package.json`);
const name = pkg.name.replace('@base-cms/parcel-plug', 'email-x').replace('/', '-');
const image = `basecms/${name}-service`;

if (version !== `v${pkg.version}`) {
  log(`Service ${name} is at version ${pkg.version}. Skipping deployment.`);
  process.exit(0);
}

const docker = async (args = []) => {
  const { status } = await spawnSync('docker', args, { stdio: 'inherit' });
  if (status !== 0) error('Image build failed!');
};

const build = async () => {
  const imageTag = `${service}:${version}`;
  log(`Building  ${image}:${version}...\n`);
  const Dockerfile = join(process.cwd(), 'services', service, 'Dockerfile');
  await spawnSync('cp', [Dockerfile, process.cwd()]);
  await docker(['login', '-u', DOCKER_USERNAME, '-p', DOCKER_PASSWORD]);
  await docker(['build', '-t', imageTag, process.cwd()]);
  await docker(['tag', imageTag, `${image}:${version}`]);
  await docker(['push', `${image}:${version}`]);
  await docker(['image', 'rm', imageTag]);
};

const deploy = async ({ key, value, image: img }) => {
  log(`Deploying ${image}:${version} on Kubernertes`);
  const { status } = await spawnSync('npx', ['@endeavorb2b/rancher2cli', 'dl', key, value, img, 'email-x']);
  if (status !== 0) error('Image deploy failed!');
};

const main = async () => { // eslint-disable-line consistent-return
  if (await shouldBuild(image)) {
    log('Image was not found, building.');
    await build();
    log('Build complete.');
  } else {
    log('Image found, skipping build.');
  }

  const { RANCHER_CLUSTERID, RANCHER_TOKEN, RANCHER_URL } = process.env;
  if (!RANCHER_CLUSTERID) return error('Deployment aborted: Environment variable RANCHER_CLUSTERID is missing!');
  if (!RANCHER_TOKEN) return error('Deployment aborted: Environment variable RANCHER_TOKEN is missing!');
  if (!RANCHER_URL) return error('Deployment aborted: Environment variable RANCHER_URL is missing!');

  await deploy({
    key: 'basecms-service',
    value: name,
    image: `${image}:${version}`,
  });
  log('  Deploy complete.\n');
};

main().catch(error);
