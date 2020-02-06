module.exports = {
  Publisher: {
    hasCustomHosts: ({ deliveryHostname, cdnHostname }) => Boolean(deliveryHostname || cdnHostname),
  },
};
