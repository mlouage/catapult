'use client'

import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'

import { ChevronRightIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const statuses = {
  offline: 'text-gray-500 bg-gray-100/10',
  online: 'text-green-400 bg-green-400/10',
  error: 'text-rose-400 bg-rose-400/10',
}

const deployments = [
  {
    id: 1,
    href: '#',
    projectName: 'xprtz.net',
    teamName: 'Websites',
    status: 'online',
    statusText: 'Initiated 1m 32s ago',
    description: 'Deploys from GitHub',
    environment: 'Production',
  },
  {
    id: 2,
    href: '#',
    projectName: 'xprtz.net',
    teamName: 'Websites',
    status: 'offline',
    statusText: 'Initiated 3m 42s ago',
    description: 'Deploys from GitHub',
    environment: 'Preview',
  },
  {
    id: 3,
    href: '#',
    projectName: 'xprtz.net',
    teamName: 'Websites',
    status: 'offline',
    statusText: 'Initiated 5m 23s ago',
    description: 'Deploys from GitHub',
    environment: 'Production',
  },
  {
    id: 4,
    href: '#',
    projectName: 'xprtz.net',
    teamName: 'Websites',
    status: 'offline',
    statusText: 'Initiated 7m 11s ago',
    description: 'Deploys from GitHub',
    environment: 'Preview',
  },
  {
    id: 5,
    href: '#',
    projectName: 'xprtz.net',
    teamName: 'Websites',
    status: 'offline',
    statusText: 'Initiated 10m 49s ago',
    description: 'Deploys from GitHub',
    environment: 'Production',
  },
  {
    id: 6,
    href: '#',
    projectName: 'xprtz.net',
    teamName: 'Websites',
    status: 'offline',
    statusText: 'Initiated 13m 18s ago',
    description: 'Deploys from GitHub',
    environment: 'Preview',
  },
]

const environments = {
  Preview: 'text-gray-400 bg-gray-400/10 ring-gray-400/20',
  Production: 'text-primary-400 bg-primary-400/10 ring-primary-400/30',
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function DeploymentList() {
  return (
    <main>
      <ul role="list" className="divide-y divide-white/5">
        {deployments.map((deployment) => (
          <li key={deployment.id} className="relative flex items-center space-x-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="min-w-0 flex-auto">
              <div className="flex items-center gap-x-3">
                <div className={classNames(statuses[deployment.status], 'flex-none rounded-full p-1')}>
                  <div className="size-2 rounded-full bg-current" />
                </div>
                <h2 className="min-w-0 text-sm/6 font-semibold text-gray-900">
                  <a href={deployment.href} className="flex gap-x-2">
                    <span className="truncate">{deployment.teamName}</span>
                    <span className="text-gray-400">/</span>
                    <span className="whitespace-nowrap">{deployment.projectName}</span>
                    <span className="absolute inset-0" />
                  </a>
                </h2>
              </div>
              <div className="mt-3 flex items-center gap-x-2.5 text-xs/5 text-gray-400">
                <p className="truncate">{deployment.description}</p>
                <svg viewBox="0 0 2 2" className="size-0.5 flex-none fill-gray-300">
                  <circle r={1} cx={1} cy={1} />
                </svg>
                <p className="whitespace-nowrap">{deployment.statusText}</p>
              </div>
            </div>
            <div
              className={classNames(
                environments[deployment.environment],
                'flex-none rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
              )}
            >
              {deployment.environment}
            </div>
            <ChevronRightIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
          </li>
        ))}
      </ul>
    </main>
  )
}
