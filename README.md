# Parcel Plug
[![Build Status](https://img.shields.io/travis/base-cms/parcel-plug.svg)](https://travis-ci.org/base-cms/parcel-plug)
[![Docker Pulls](https://img.shields.io/docker/pulls/basecms/parcel-plug.svg?)](https://hub.docker.com/r/basecms/parcel-plug/)
[![Image Size](https://img.shields.io/microbadger/image-size/basecms/parcel-plug/latest.svg)](https://microbadger.com/images/basecms/parcel-plug)

## Orders
- Set name
- Select advertiser
- Add line items

## Line Items
- Set name
- Select inventory
  - Can contain ad units, deployments, or publishers
- Select priority (1 - 5)
  - Higher number will serve before lower number
- Select days/dates to display
  - Can be individual days
  - Can be a date range (all days within it)
- Set status
  - Enable a way to pause/stop a line item, or leave it in draft
- Add ads

## Ads
- Set name
- Set width/height
- Set click URL
- Upload image asset


## Request Params
`[click|image]/{adunitId}?date=2019-14-01T08:50:00-0600&email=user@domain.com@rand={random}&send={identifier}`

## Ad Status
### Flags
**Deleted (`deleted: true|false`)**
Defaults to false.
Determines if the ad has been outright deleted from the system.
Ads can be deleted via the interface.

**Paused (`paused: true|false`)**
Defaults to false.
Determines if the ad is paused
Ads can be paused via the interface.

**Ready (`ready: true|false`)**
Defaults to false.
Determines if the ad is ready to be delivered.
Is controlled (and saved) by the backend. Is _not_ toggleable in the interface.
Is true when:
  - The image ratio is compatible with the ad `width` and `height` fields

### Status
This field is not saved directly on the model and, instead, is calculated using flags.
In priority order (acts like a `switch` block):
- Deleted
  - When `deleted: true`
- Incomplete
  - When `ready: false`
- Paused
  - When `paused: true`
- Active
  - When all of the above criteria are not met

## Line Item Status

### Flags
**Deleted (`deleted: true|false`)**
Defaults to false.
Determines if the line item has been outright deleted from the system.
Line items can be deleted via the interface.

**Ready (`ready: true|false`)**
Defaults to false.
Determines if the line item is ready to be delivered.
Is controlled (and saved) by the backend. Is _not_ toggleable in the interface.
Is true when:
- The `dates.start` and `dates.end` values are both set, or `dates.days` is set and not empty.
- The `targeting` value has a least one id set (for either ad units, deployments, or publishers).
- The line item has at least one `Active` ad.

**Paused (`paused: true|false`)**
Defaults to false.
Is directly toggleable in the interface.

#### Status
This field is not saved directly on the model and, instead, is calculated using flags.
In priority order (acts like a `switch` block):
- Deleted
  - When `deleted: true`
- Finished
  - When `dates.end` or the newest/greatest `dates.day` value is less than or equal to now
- Incomplete
  - When `ready: false`
- Paused
  - When `paused: true`
- Running
  - When `dates.start` or the oldest/least `dates.day` value is less than or equal to now
- Scheduled
  - When all of the above criteria is not met
