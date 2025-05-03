'use client'

import { CheckCircleIcon } from '@heroicons/react/24/solid'

const activity = [
  { id: 1, type: 'published', person: { name: 'Chelsea Hagon' }, date: '7d ago', dateTime: '2023-01-23T10:32' },
  { id: 2, type: 'published', person: { name: 'Chelsea Hagon' }, date: '6d ago', dateTime: '2023-01-23T11:03' },
  { id: 3, type: 'published', person: { name: 'Chelsea Hagon' }, date: '6d ago', dateTime: '2023-01-23T11:24' },
  { id: 5, type: 'published', person: { name: 'Alex Curren' }, date: '2d ago', dateTime: '2023-01-24T09:12' },
  { id: 6, type: 'published', person: { name: 'Alex Curren' }, date: '1d ago', dateTime: '2023-01-24T09:20' },
  { id: 7, type: 'published', person: { name: 'Chelsea Hagon' }, date: '7d ago', dateTime: '2023-01-23T10:32' },
  { id: 8, type: 'deployed', person: { name: 'Chelsea Hagon' }, date: '6d ago', dateTime: '2023-01-23T11:03' },
  { id: 9, type: 'deployed', person: { name: 'Chelsea Hagon' }, date: '6d ago', dateTime: '2023-01-23T11:24' },
  { id: 10, type: 'deployed', person: { name: 'Alex Curren' }, date: '2d ago', dateTime: '2023-01-24T09:12' },
  { id: 11, type: 'deployed', person: { name: 'Alex Curren' }, date: '1d ago', dateTime: '2023-01-24T09:20' },
  { id: 12, type: 'deployed', person: { name: 'Chelsea Hagon' }, date: '7d ago', dateTime: '2023-01-23T10:32' },
  { id: 13, type: 'deployed', person: { name: 'Chelsea Hagon' }, date: '6d ago', dateTime: '2023-01-23T11:03' },
  { id: 14, type: 'deployed', person: { name: 'Chelsea Hagon' }, date: '6d ago', dateTime: '2023-01-23T11:24' },
  { id: 15, type: 'deployed', person: { name: 'Alex Curren' }, date: '2d ago', dateTime: '2023-01-24T09:12' },
  { id: 16, type: 'deployed', person: { name: 'Alex Curren' }, date: '1d ago', dateTime: '2023-01-24T09:20' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Feed() {

  return (
    <>
      <ul role="list" className="space-y-6 mt-4">
        {activity.map((activityItem, activityItemIdx) => (
          <li key={activityItem.id} className="relative flex gap-x-4">
            <div
              className={classNames(
                activityItemIdx === activity.length - 1 ? 'h-6' : '-bottom-6',
                'absolute top-0 left-0 flex w-6 justify-center',
              )}
            >
              <div className="w-px bg-gray-200" />
            </div>
              <>
                <div className="relative flex size-6 flex-none items-center justify-center bg-white">
                  {activityItem.type === 'deployed' ? (
                    <CheckCircleIcon aria-hidden="true" className="size-6 text-primary-600" />
                  ) : (
                    <div className="size-1.5 rounded-full bg-gray-100 ring-1 ring-gray-300" />
                  )}
                </div>
                <p className="flex-auto py-0.5 text-xs/5 text-gray-500">
                  <span className="font-medium text-gray-900">{activityItem.person.name}</span> {activityItem.type} the
                  invoice.
                </p>
                <time dateTime={activityItem.dateTime} className="flex-none py-0.5 text-xs/5 text-gray-500">
                  {activityItem.date}
                </time>
              </>
          </li>
        ))}
      </ul>
    </>
  )
}
