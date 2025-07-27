# CommBox API Endpoint Index

Complete list of all API endpoints organized by category.

## Summary

- **Total Categories:** 15
- **Total Endpoints:** 49

## Categories

- [Assignments](#assignments) (1 endpoint)
- [Authentication](#authentication) (1 endpoint)
- [Automation](#automation) (2 endpoints)
- [Core](#core) (1 endpoint)
- [Forms](#forms) (2 endpoints)
- [Managers](#managers) (3 endpoints)
- [Objects](#objects) (12 endpoints)
- [Presence](#presence) (3 endpoints)
- [Profiles](#profiles) (4 endpoints)
- [SMS](#sms) (2 endpoints)
- [Streams](#streams) (4 endpoints)
- [Tags](#tags) (5 endpoints)
- [Teams](#teams) (2 endpoints)
- [Users](#users) (2 endpoints)
- [WhatsApp](#whatsapp) (5 endpoints)

---

## Assignments

**Endpoints:** 1

| Method | Endpoint | Description |
|--------|----------|-------------|
| DELETE | `/managers/{MANAGER_ID}/assignments` | Unassign Manager |
| GET | `/managers/{MANAGER_ID}/assignments` | Get Manager Assignments |
| POST | `/managers/{MANAGER_ID}/assignments` | Assign Manager |

## Authentication

**Endpoints:** 1

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/ticket` | Create Ticket |

## Automation

**Endpoints:** 2

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/automation/objects/{OBJECT_ID}/context` | Get Object Context |
| POST | `/automation/objects/{OBJECT_ID}/context` | Insert Data Context |
| POST | `/automation/objects/{OBJECT_ID}/context/jump` | Jump to node |

## Core

**Endpoints:** 1

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/core/systemstatus` | System Status |

## Forms

**Endpoints:** 2

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/forms/createlink/{FORM_ID}` | Create Form Link |
| POST | `/forms/createpredefinedlink/{FORM_ID}` | Create Predefined Form Link |

## Managers

**Endpoints:** 3

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/managers` | Get Managers |
| POST | `/managers` | Create Manager |
| DELETE | `/managers/{MANAGER_ID}` | Delete Manager |
| GET | `/managers/{MANAGER_ID}` | Get Manager |
| POST | `/managers/{MANAGER_ID}` | Update Manager |
| GET | `/managers/{MANAGER_ID}/stats` | Get Manager Stats |

## Objects

**Endpoints:** 12

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/objects/{OBJECT_ID}/activities` | Get Object's Activities |
| POST | `/objects/{OBJECT_ID}/activitylog` | Add Activity Log |
| POST | `/objects/{OBJECT_ID}/content` | Set Object Content |
| POST | `/objects/{OBJECT_ID}/indicators` | Set Custom Indicator |
| DELETE | `/objects/{OBJECT_ID}/indicators/{INDICATOR_ID}` | Delete Custom Indicator |
| POST | `/objects/{OBJECT_ID}/remarks` | Add Remark Log |
| POST | `/objects/{OBJECT_ID}/status/{STATUS_ID}` | Set Object Status |
| PATCH | `/objects/{OBJECT_ID}/stream` | Update Object's Stream |
| POST | `/streams/{STREAM_ID}/objects` | Create Object |
| GET | `/streams/{STREAM_ID}/objects/{OBJECT_ID}` | Get Object |
| POST | `/streams/{STREAM_ID}/objects/{OBJECT_ID}/child` | Create Child Object |
| GET | `/streams/{STREAM_ID}/objects/{OBJECT_ID}/transcript` | Get Object's Transcript |

## Presence

**Endpoints:** 3

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/managers/presence` | Get Presence Types |
| GET | `/managers/{MANAGER_ID}/presence` | Get Manager Presence |
| POST | `/managers/{MANAGER_ID}/presence/{ACTIVITY_ID}` | Update Manager Presence |

## Profiles

**Endpoints:** 4

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/managers/profiles` | Get Profiles |
| GET | `/managers/profiles/{PROFILE_ID}` | Get Managers By Profile ID |
| DELETE | `/managers/{MANAGER_ID}/profiles` | Remove All Agent Profiles |
| POST | `/managers/{MANAGER_ID}/profiles` | Add Profiles |
| DELETE | `/managers/{MANAGER_ID}/profiles/{PROFILE_ID}` | Delete Manager Profile |

## SMS

**Endpoints:** 2

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/sms/sendinitialtext/{ENCRYPTED_STREAM_ID}/{PHONE_NUMBER}` | Send Initial SMS (Texting) |
| POST | `/sms/sendsms/{ENCRYPTED_STREAM_ID}` | Sends SMS (Texting) |

## Streams

**Endpoints:** 4

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stats/streams` | Get Streams Stats |
| GET | `/stats/streamsSLAExceptions` | Get SLA Breach Summary |
| GET | `/streams/{STREAM_ID}/objects` | Get Stream Objects |
| GET | `/streams/{STREAM_ID}/streamavailability` | Get Stream Availability |

## Tags

**Endpoints:** 5

| Method | Endpoint | Description |
|--------|----------|-------------|
| DELETE | `/streams/{STREAM_ID}/objects/{OBJECT_ID}/tags/{TAG_ID}` | Delete Object Tag |
| POST | `/streams/{STREAM_ID}/objects/{OBJECT_ID}/tags/{TAG_ID}` | Set Object Tag |
| GET | `/tags` | Get Tags |
| POST | `/tags` | Create a Tag |
| GET | `/tags/groups` | Get Tags Group |
| POST | `/tags/groups` | Create Tags Group |
| DELETE | `/tags/groups/{TAGS_GROUP_ID}` | Delete a Tags group |
| POST | `/tags/groups/{TAGS_GROUP_ID}` | Update Tags Group |
| DELETE | `/tags/{TAG_ID}` | Delete a Tag |
| POST | `/tags/{TAG_ID}` | Updating a Tag |

## Teams

**Endpoints:** 2

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/managers/teams` | Get All Teams |
| POST | `/managers/teams` | Create a Team |
| DELETE | `/managers/teams/{TEAM_ID}` | Delete a Team |
| GET | `/managers/teams/{TEAM_ID}` | Get Team Members |
| POST | `/managers/teams/{TEAM_ID}` | Update Team by Team Id |

## Users

**Endpoints:** 2

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/identities/{USER_IDENTITY_ID}/objects` | Get User Objects |
| GET | `/users/{USER_ID}` | Get User |
| POST | `/users/{USER_ID}` | Update User |

## WhatsApp

**Endpoints:** 5

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/emarsys/sendwhatsapptemplate/{ENCRYPTED_STREAM_ID}` | Send a WhatsApp template message from Emarsys |
| POST | `/v2/whatsapp/sendtemplatedmessage/{ENCRYPTED_STREAM_ID}` | Send WhatsApp Templated Message V2 |
| POST | `/whatsapp/campaign` | Send Campaign |
| POST | `/whatsapp/uploadmedia/{ENCRYPTED_STREAM_ID}` | Returns a WhatsApp ID for an uploaded file |
| GET | `/whatsapp/validatecontact/{ENCRYPTED_STREAM_ID}/{PHONE_NUMBER}` | Validate WhatsApp account |

