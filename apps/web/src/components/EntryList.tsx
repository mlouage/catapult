const statuses = {
  Completed: 'text-green-700 bg-green-50 ring-green-600/20',
  Failed: 'text-red-800 bg-red-50 ring-red-600/20',
}
const projects = [
  {
    id: 1,
    name: 'GraphQL API',
    href: '#',
    status: 'Completed',
    createdBy: 'Leslie Alexander',
    dueDate: 'March 17, 2023',
    dueDateTime: '2023-03-17T00:00Z',
  },
  {
    id: 2,
    name: 'New benefits plan',
    href: '#',
    status: 'Completed',
    createdBy: 'Leslie Alexander',
    dueDate: 'May 5, 2023',
    dueDateTime: '2023-05-05T00:00Z',
  },
  {
    id: 3,
    name: 'Onboarding emails',
    href: '#',
    status: 'Failed',
    createdBy: 'Courtney Henry',
    dueDate: 'May 25, 2023',
    dueDateTime: '2023-05-25T00:00Z',
  },
  {
    id: 4,
    name: 'iOS app',
    href: '#',
    status: 'Completed',
    createdBy: 'Leonard Krasner',
    dueDate: 'June 7, 2023',
    dueDateTime: '2023-06-07T00:00Z',
  },
  {
    id: 5,
    name: 'Marketing site redesign',
    href: '#',
    status: 'Completed',
    createdBy: 'Courtney Henry',
    dueDate: 'June 10, 2023',
    dueDateTime: '2023-06-10T00:00Z',
  },
  {
    id: 6,
    name: 'GraphQL API',
    href: '#',
    status: 'Completed',
    createdBy: 'Leslie Alexander',
    dueDate: 'March 17, 2023',
    dueDateTime: '2023-03-17T00:00Z',
  },
  {
    id: 7,
    name: 'New benefits plan',
    href: '#',
    status: 'Completed',
    createdBy: 'Leslie Alexander',
    dueDate: 'May 5, 2023',
    dueDateTime: '2023-05-05T00:00Z',
  },
  {
    id: 8,
    name: 'Onboarding emails',
    href: '#',
    status: 'Failed',
    createdBy: 'Courtney Henry',
    dueDate: 'May 25, 2023',
    dueDateTime: '2023-05-25T00:00Z',
  },
  {
    id: 9,
    name: 'iOS app',
    href: '#',
    status: 'Completed',
    createdBy: 'Leonard Krasner',
    dueDate: 'June 7, 2023',
    dueDateTime: '2023-06-07T00:00Z',
  },
  {
    id: 10,
    name: 'Marketing site redesign',
    href: '#',
    status: 'Completed',
    createdBy: 'Courtney Henry',
    dueDate: 'June 10, 2023',
    dueDateTime: '2023-06-10T00:00Z',
  },
]

const events = [
  {
    "id": 15,
    "receivedAt": "2025-05-03T07:20:38.776Z",
    "eventName": "entry.publish",
    "model": "tag",
    "uid": "api::tag.tag",
    "documentId": "l1ol0maltllnbk1we8jd37kv",
    "locale": null,
    "eventCreatedAt": "2025-05-03T07:20:38.736Z",
    "eventUpdatedAt": "2025-05-03T07:20:38.686Z",
    "eventPublishedAt": "2025-05-03T07:20:38.702Z",
    "entryId": 23,
    "entryTitle": "sql",
    "createdByFirstname": "Maarten",
    "updatedByFirstname": "Maarten",
    "createdByLastname": "Louage",
    "updatedByLastname": "Louage",
    "entryPayload": {
      "id": 23,
      "title": "sql",
      "articles": [],
      "createdAt": "2025-05-03T07:20:38.686Z",
      "createdBy": {
        "id": 1,
        "lastname": "Louage",
        "username": null,
        "createdAt": "2025-04-29T16:52:12.804Z",
        "firstname": "Maarten",
        "updatedAt": "2025-04-29T16:52:12.804Z",
        "documentId": "et4oyoc9d0cbqzd53tr5x7dd",
        "publishedAt": "2025-04-29T16:52:12.804Z",
        "preferedLanguage": null
      },
      "updatedAt": "2025-05-03T07:20:38.686Z",
      "updatedBy": {
        "id": 1,
        "lastname": "Louage",
        "username": null,
        "createdAt": "2025-04-29T16:52:12.804Z",
        "firstname": "Maarten",
        "updatedAt": "2025-04-29T16:52:12.804Z",
        "documentId": "et4oyoc9d0cbqzd53tr5x7dd",
        "publishedAt": "2025-04-29T16:52:12.804Z",
        "preferedLanguage": null
      },
      "documentId": "l1ol0maltllnbk1we8jd37kv",
      "publishedAt": "2025-05-03T07:20:38.702Z"
    },
    "releaseId": 3
  },
  {
    "id": 16,
    "receivedAt": "2025-05-03T07:20:51.613Z",
    "eventName": "entry.publish",
    "model": "tag",
    "uid": "api::tag.tag",
    "documentId": "s5tg4zanc0fphsbxcayb6pmp",
    "locale": null,
    "eventCreatedAt": "2025-05-03T07:20:51.606Z",
    "eventUpdatedAt": "2025-05-03T07:20:51.543Z",
    "eventPublishedAt": "2025-05-03T07:20:51.573Z",
    "entryId": 25,
    "entryTitle": "react",
    "createdByFirstname": "Maarten",
    "updatedByFirstname": "Maarten",
    "createdByLastname": "Louage",
    "updatedByLastname": "Louage",
    "entryPayload": {
      "id": 25,
      "title": "react",
      "articles": [],
      "createdAt": "2025-05-03T07:20:51.543Z",
      "createdBy": {
        "id": 1,
        "lastname": "Louage",
        "username": null,
        "createdAt": "2025-04-29T16:52:12.804Z",
        "firstname": "Maarten",
        "updatedAt": "2025-04-29T16:52:12.804Z",
        "documentId": "et4oyoc9d0cbqzd53tr5x7dd",
        "publishedAt": "2025-04-29T16:52:12.804Z",
        "preferedLanguage": null
      },
      "updatedAt": "2025-05-03T07:20:51.543Z",
      "updatedBy": {
        "id": 1,
        "lastname": "Louage",
        "username": null,
        "createdAt": "2025-04-29T16:52:12.804Z",
        "firstname": "Maarten",
        "updatedAt": "2025-04-29T16:52:12.804Z",
        "documentId": "et4oyoc9d0cbqzd53tr5x7dd",
        "publishedAt": "2025-04-29T16:52:12.804Z",
        "preferedLanguage": null
      },
      "documentId": "s5tg4zanc0fphsbxcayb6pmp",
      "publishedAt": "2025-05-03T07:20:51.573Z"
    },
    "releaseId": 3
  },
  {
    "id": 17,
    "receivedAt": "2025-05-03T07:20:59.676Z",
    "eventName": "entry.publish",
    "model": "tag",
    "uid": "api::tag.tag",
    "documentId": "w0pxq5mwpxnabpjbjjepj33g",
    "locale": null,
    "eventCreatedAt": "2025-05-03T07:20:59.668Z",
    "eventUpdatedAt": "2025-05-03T07:20:59.613Z",
    "eventPublishedAt": "2025-05-03T07:20:59.632Z",
    "entryId": 27,
    "entryTitle": "typescript",
    "createdByFirstname": "Maarten",
    "updatedByFirstname": "Maarten",
    "createdByLastname": "Louage",
    "updatedByLastname": "Louage",
    "entryPayload": {
      "id": 27,
      "title": "typescript",
      "articles": [],
      "createdAt": "2025-05-03T07:20:59.613Z",
      "createdBy": {
        "id": 1,
        "lastname": "Louage",
        "username": null,
        "createdAt": "2025-04-29T16:52:12.804Z",
        "firstname": "Maarten",
        "updatedAt": "2025-04-29T16:52:12.804Z",
        "documentId": "et4oyoc9d0cbqzd53tr5x7dd",
        "publishedAt": "2025-04-29T16:52:12.804Z",
        "preferedLanguage": null
      },
      "updatedAt": "2025-05-03T07:20:59.613Z",
      "updatedBy": {
        "id": 1,
        "lastname": "Louage",
        "username": null,
        "createdAt": "2025-04-29T16:52:12.804Z",
        "firstname": "Maarten",
        "updatedAt": "2025-04-29T16:52:12.804Z",
        "documentId": "et4oyoc9d0cbqzd53tr5x7dd",
        "publishedAt": "2025-04-29T16:52:12.804Z",
        "preferedLanguage": null
      },
      "documentId": "w0pxq5mwpxnabpjbjjepj33g",
      "publishedAt": "2025-05-03T07:20:59.632Z"
    },
    "releaseId": 3
  },
  {
    "id": 18,
    "receivedAt": "2025-05-03T13:41:18.578Z",
    "eventName": "entry.publish",
    "model": "author",
    "uid": "api::author.author",
    "documentId": "rk4x0vyak61f0q5j53nenzdk",
    "locale": "nl-NL",
    "eventCreatedAt": "2025-05-03T13:41:18.568Z",
    "eventUpdatedAt": "2025-05-03T13:41:18.500Z",
    "eventPublishedAt": "2025-05-03T13:41:18.525Z",
    "entryId": 9,
    "entryTitle": null,
    "createdByFirstname": "Maarten",
    "updatedByFirstname": "Maarten",
    "createdByLastname": "Louage",
    "updatedByLastname": "Louage",
    "entryPayload": {
      "id": 9,
      "email": "maarten@xprtz.net",
      "avatar": {
        "id": 1,
        "ext": ".jpg",
        "url": "/uploads/IVO_Rechtspraak_De_Profielfotograaf_2024_12_12_IMG_2187_LOWRES_78db864ad3.jpg",
        "hash": "IVO_Rechtspraak_De_Profielfotograaf_2024_12_12_IMG_2187_LOWRES_78db864ad3",
        "mime": "image/jpeg",
        "name": "IVO Rechtspraak - De Profielfotograaf - 2024-12-12 - IMG_2187 LOWRES.jpg",
        "size": 28.52,
        "width": 500,
        "height": 500,
        "caption": null,
        "formats": {
          "thumbnail": {
            "ext": ".jpg",
            "url": "/uploads/thumbnail_IVO_Rechtspraak_De_Profielfotograaf_2024_12_12_IMG_2187_LOWRES_78db864ad3.jpg",
            "hash": "thumbnail_IVO_Rechtspraak_De_Profielfotograaf_2024_12_12_IMG_2187_LOWRES_78db864ad3",
            "mime": "image/jpeg",
            "name": "thumbnail_IVO Rechtspraak - De Profielfotograaf - 2024-12-12 - IMG_2187 LOWRES.jpg",
            "path": null,
            "size": 4.9,
            "width": 156,
            "height": 156,
            "sizeInBytes": 4896
          }
        },
        "provider": "local",
        "createdAt": "2025-05-02T17:52:33.090Z",
        "updatedAt": "2025-05-02T17:52:33.090Z",
        "documentId": "vx5zciamif1vo6yeklvumx3h",
        "previewUrl": null,
        "publishedAt": "2025-05-02T17:52:33.091Z",
        "alternativeText": null,
        "provider_metadata": null
      },
      "gitHub": "mlouage",
      "locale": "nl-NL",
      "jobTitle": "Software developer",
      "lastname": "Louage",
      "biography": "Bio",
      "createdAt": "2025-05-03T13:41:18.500Z",
      "createdBy": {
        "id": 1,
        "lastname": "Louage",
        "username": null,
        "createdAt": "2025-04-29T16:52:12.804Z",
        "firstname": "Maarten",
        "updatedAt": "2025-04-29T16:52:12.804Z",
        "documentId": "et4oyoc9d0cbqzd53tr5x7dd",
        "publishedAt": "2025-04-29T16:52:12.804Z",
        "preferedLanguage": null
      },
      "firstname": "Maarten",
      "realTitle": "Bouwt behalve met C# ook met Go",
      "updatedAt": "2025-05-03T13:41:18.500Z",
      "updatedBy": {
        "id": 1,
        "lastname": "Louage",
        "username": null,
        "createdAt": "2025-04-29T16:52:12.804Z",
        "firstname": "Maarten",
        "updatedAt": "2025-04-29T16:52:12.804Z",
        "documentId": "et4oyoc9d0cbqzd53tr5x7dd",
        "publishedAt": "2025-04-29T16:52:12.804Z",
        "preferedLanguage": null
      },
      "documentId": "rk4x0vyak61f0q5j53nenzdk",
      "publishedAt": "2025-05-03T13:41:18.525Z"
    },
    "releaseId": 3
  },
  {
    "id": 19,
    "receivedAt": "2025-05-03T13:44:57.726Z",
    "eventName": "entry.publish",
    "model": "page",
    "uid": "api::page.page",
    "documentId": "rlrix9n3k2ysv73jpomqehy7",
    "locale": "nl-NL",
    "eventCreatedAt": "2025-05-03T13:44:57.718Z",
    "eventUpdatedAt": "2025-05-03T13:44:57.638Z",
    "eventPublishedAt": "2025-05-03T13:44:57.676Z",
    "entryId": 2,
    "entryTitle": null,
    "createdByFirstname": "Maarten",
    "updatedByFirstname": "Maarten",
    "createdByLastname": "Louage",
    "updatedByLastname": "Louage",
    "entryPayload": {
      "id": 2,
      "site": "dotnet",
      "slug": "page",
      "locale": "nl-NL",
      "tagline": "Hoe komen met elkaar in contact",
      "createdAt": "2025-05-03T13:44:57.638Z",
      "createdBy": {
        "id": 1,
        "lastname": "Louage",
        "username": null,
        "createdAt": "2025-04-29T16:52:12.804Z",
        "firstname": "Maarten",
        "updatedAt": "2025-04-29T16:52:12.804Z",
        "documentId": "et4oyoc9d0cbqzd53tr5x7dd",
        "publishedAt": "2025-04-29T16:52:12.804Z",
        "preferedLanguage": null
      },
      "title_cms": "[dotnet] Contact",
      "updatedAt": "2025-05-03T13:44:57.638Z",
      "updatedBy": {
        "id": 1,
        "lastname": "Louage",
        "username": null,
        "createdAt": "2025-04-29T16:52:12.804Z",
        "firstname": "Maarten",
        "updatedAt": "2025-04-29T16:52:12.804Z",
        "documentId": "et4oyoc9d0cbqzd53tr5x7dd",
        "publishedAt": "2025-04-29T16:52:12.804Z",
        "preferedLanguage": null
      },
      "components": [
        {
          "id": 2,
          "content": "Zo dan",
          "__component": "ui.text"
        }
      ],
      "documentId": "rlrix9n3k2ysv73jpomqehy7",
      "description": "Contact pagina",
      "publishedAt": "2025-05-03T13:44:57.676Z",
      "title_website": "Contact"
    },
    "releaseId": 3
  }
]

export default function DeploymentList() {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
      <ul role="list" className="divide-y divide-gray-100">
        {events.map((event) => (
            <li key={event.id} className="flex items-center justify-between gap-x-6 py-5">
              <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                  <p className="text-sm/6 font-semibold text-gray-900">{event.model} {event.entryTitle ?? event.documentId}</p>
                </div>
                <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
                  <p className="whitespace-nowrap">
                    Published on <time dateTime={event.eventPublishedAt}>{formatDate(event.eventPublishedAt)}</time>
                  </p>
                  <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                    <circle r={1} cx={1} cy={1} />
                  </svg>
                  <p className="truncate">{event.createdByFirstname + ' ' + event.createdByLastname}</p>
                </div>
              </div>
              <div className="flex flex-none items-center gap-x-4">
                <a
                  href={`http://localhost:1337/admin/content-manager/collection-types/${event.uid}/${event.documentId}?status=published`}
                  className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-primary-700 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:block"
                >
                  View in CMS<span className="sr-only">, {event.name}</span>
                </a>
              </div>
            </li>
        ))}
      </ul>
  )
}
