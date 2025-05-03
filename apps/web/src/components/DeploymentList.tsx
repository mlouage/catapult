import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid'

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

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function DeploymentList() {
  return (
      <ul role="list" className="divide-y divide-gray-100">
        {projects.map((project) => (
            <li key={project.id} className="flex items-center justify-between gap-x-6 py-5">
              <div className="min-w-0">
                <div className="flex items-start gap-x-3">
                  <p className="text-sm/6 font-semibold text-gray-900">{project.name}</p>
                  <p
                      className={classNames(
                          statuses[project.status],
                          'mt-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
                      )}
                  >
                    {project.status}
                  </p>
                </div>
                <div className="mt-1 flex items-center gap-x-2 text-xs/5 text-gray-500">
                  <p className="whitespace-nowrap">
                    Deployed on <time dateTime={project.dueDateTime}>{project.dueDate}</time>
                  </p>
                  <svg viewBox="0 0 2 2" className="size-0.5 fill-current">
                    <circle r={1} cx={1} cy={1} />
                  </svg>
                  <p className="truncate">{project.createdBy}</p>
                </div>
              </div>
              <div className="flex flex-none items-center gap-x-4">
                <a
                    href={project.href}
                    className="hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-primary-700 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:block"
                >
                  View deployment<span className="sr-only">, {project.name}</span>
                </a>
              </div>
              {/*  <Menu as="div" className="relative flex-none">*/}
              {/*    <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">*/}
              {/*      <span className="sr-only">Open options</span>*/}
              {/*      <EllipsisVerticalIcon aria-hidden="true" className="size-5" />*/}
              {/*    </MenuButton>*/}
              {/*    <MenuItems*/}
              {/*        transition*/}
              {/*        className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"*/}
              {/*    >*/}
              {/*      <MenuItem>*/}
              {/*        <a*/}
              {/*            href="#"*/}
              {/*            className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"*/}
              {/*        >*/}
              {/*          Edit<span className="sr-only">, {project.name}</span>*/}
              {/*        </a>*/}
              {/*      </MenuItem>*/}
              {/*      <MenuItem>*/}
              {/*        <a*/}
              {/*            href="#"*/}
              {/*            className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"*/}
              {/*        >*/}
              {/*          Move<span className="sr-only">, {project.name}</span>*/}
              {/*        </a>*/}
              {/*      </MenuItem>*/}
              {/*      <MenuItem>*/}
              {/*        <a*/}
              {/*            href="#"*/}
              {/*            className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"*/}
              {/*        >*/}
              {/*          Delete<span className="sr-only">, {project.name}</span>*/}
              {/*        </a>*/}
              {/*      </MenuItem>*/}
              {/*    </MenuItems>*/}
              {/*  </Menu>*/}
              {/*</div>*/}
            </li>
        ))}
      </ul>
  )
}
