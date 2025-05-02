import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useMsal } from '@azure/msal-react'
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest } from '../authConfig'
import { Menu, MenuButton, MenuItems, MenuItem, Dialog, DialogBackdrop, DialogPanel, TransitionChild } from '@headlessui/react'
import { HomeIcon, FolderIcon, DocumentDuplicateIcon, Cog6ToothIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

import Logo from '../assets/symbol-xprtz.svg'

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const navigation = [
  { name: 'Dashboard', to: '/dashboard', icon: HomeIcon },
  { name: 'Releases', to: '/releases', icon: FolderIcon },
  { name: 'Deployments', to: '/deployments', icon: DocumentDuplicateIcon },
]

const teams = [
  { name: 'Developers', to: '/teams/developers', initial: 'D' },
  { name: 'Administrators', to: '/teams/administrators', initial: 'A' },
]

const userNavigation = [
  { name: 'Your profile', to: '/profile' },
  { name: 'Log out', to: '/logout' },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { instance, accounts, inProgress } = useMsal();
  const account = accounts[0];
  const [user, setUser] = useState<{ name: string; email: string; givenName: string; surname: string  } | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);

  // Fetch user profile and photo from Microsoft Graph
  useEffect(() => {
    const fetchProfile = async () => {
      if (account && inProgress === InteractionStatus.None) {
        try {
          const response = await instance.acquireTokenSilent({
            ...loginRequest,
            account,
          });
          const headers = new Headers();
          headers.append("Authorization", `Bearer ${response.accessToken}`);

          // Fetch user profile
          const profileRes = await fetch("https://graph.microsoft.com/v1.0/me", { headers });
          if (profileRes.ok) {
            const profileData = await profileRes.json();
            setUser({
              name: profileData.displayName,
              email: profileData.mail || profileData.userPrincipalName,
              givenName: profileData.givenName,
              surname: profileData.surname,
            });
          }

          // Fetch profile photo
          const photoRes = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", { headers });
          if (photoRes.ok) {
            const blob = await photoRes.blob();
            setPhoto(URL.createObjectURL(blob));
          }
        } catch (error) {
          console.error("Error fetching profile: ", error);
        }
      } else if (inProgress !== InteractionStatus.None) {
        console.log("MSAL interaction in progress, waiting...");
      } else if (!account) {
        console.error("No account or in progress");
      }
    };
    fetchProfile();
  }, [account, instance, inProgress]);

  // Redirect to login if not authenticated
  if (!account) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      {/* Mobile sidebar */}
      <Dialog open={sidebarOpen} onClose={setSidebarOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop className="fixed inset-0 bg-gray-900/80" />
        <div className="fixed inset-0 flex">
          <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out">
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5">
                <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5 text-white">
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>
            </TransitionChild>
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary-600 px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center">
                <img
                  alt="Your Company"
                  src={Logo}
                  className="h-8 w-auto"
                />
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => (
                        <li key={item.name}>
                          <NavLink
                            to={item.to}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                              classNames(
                                isActive
                                  ? 'bg-primary-700 text-white'
                                  : 'text-primary-200 hover:bg-primary-700 hover:text-white',
                                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                              )
                            }
                          >
                            <item.icon aria-hidden="true" className="size-6 shrink-0" />
                            {item.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li>
                    <div className="text-xs/6 font-semibold text-primary-200">Your teams</div>
                    <ul role="list" className="-mx-2 mt-2 space-y-1">
                      {teams.map((team) => (
                        <li key={team.name}>
                          <NavLink
                            to={team.to}
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                              classNames(
                                isActive
                                  ? 'bg-primary-700 text-white'
                                  : 'text-primary-200 hover:bg-primary-700 hover:text-white',
                                'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                              )
                            }
                          >
                            <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-primary-400 bg-primary-500 text-[0.625rem] font-medium text-white">
                              {team.initial}
                            </span>
                            <span className="truncate">{team.name}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="mt-auto">
                    <NavLink
                      to="/settings"
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? 'bg-primary-700 text-white'
                            : 'text-primary-200 hover:bg-primary-700 hover:text-white',
                          'group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                        )
                      }
                    >
                      <Cog6ToothIcon aria-hidden="true" className="size-6 shrink-0" />
                      Settings
                    </NavLink>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
          <div className="w-14 flex-shrink-0" aria-hidden="true" />
        </div>
      </Dialog>
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col bg-primary-600 px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <img
            alt="XPRTZ B.V."
            src={Logo}
            className="h-8 w-auto"
          />
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? 'bg-primary-700 text-white'
                            : 'text-primary-200 hover:bg-primary-700 hover:text-white',
                          'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                        )
                      }
                    >
                      <item.icon aria-hidden="true" className="size-6 shrink-0" />
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <div className="text-xs/6 font-semibold text-primary-200">Your teams</div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {teams.map((team) => (
                  <li key={team.name}>
                    <NavLink
                      to={team.to}
                      className={({ isActive }) =>
                        classNames(
                          isActive
                            ? 'bg-primary-700 text-white'
                            : 'text-primary-200 hover:bg-primary-700 hover:text-white',
                          'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                        )
                      }
                    >
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-primary-400 bg-primary-500 text-[0.625rem] font-medium text-white">
                        {team.initial}
                      </span>
                      <span className="truncate">{team.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
            <li className="mt-auto">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  classNames(
                    isActive
                      ? 'bg-primary-700 text-white'
                      : 'text-primary-200 hover:bg-primary-700 hover:text-white',
                    'group -mx-2 flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                  )
                }
              >
                <Cog6ToothIcon aria-hidden="true" className="size-6 shrink-0" />
                Settings
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <div className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
          <div aria-hidden="true" className="h-6 w-px bg-gray-900/10 lg:hidden" />
          <div className="grid flex-1 grid-cols-1">
            &nbsp;
            {/* <input
              name="search"
              type="search"
              placeholder="Search"
              aria-label="Search"
              className="col-start-1 row-start-1 block size-full bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6"
            /> */}
            {/* <MagnifyingGlassIcon
              aria-hidden="true"
              className="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400"
            /> */}
          </div>
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            {/* <button type="button" className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
              <span className="sr-only">View notifications</span>
              <BellIcon aria-hidden="true" className="size-6" />
            </button> */}
            <div aria-hidden="true" className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" />
            <Menu as="div" className="relative">
            <MenuButton className="-m-1.5 flex items-center p-1.5">
                <span className="sr-only">Open user menu</span>
                {photo ? (
                  <img
                    alt={user?.givenName && user?.surname ? user?.givenName + " " + user?.surname : account.username}
                    src={photo}
                    className="size-8 rounded-full bg-gray-50"
                  />
                ) : (
                  <span className="size-8 inline-flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-sm font-medium">
                    {user?.givenName && user?.surname ? user.givenName.charAt(0) + user.surname.charAt(0) : account.username.charAt(0)}
                  </span>
                )}
                <span className="hidden lg:flex lg:items-center">
                  <span aria-hidden="true" className="ml-4 text-sm/6 font-semibold text-gray-900">
                    {user?.givenName && user?.surname ? user?.givenName + " " + user?.surname : account.username}
                  </span>
                  <ChevronDownIcon aria-hidden="true" className="ml-2 size-5 text-gray-400" />
                </span>
              </MenuButton>
              <MenuItems className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-hidden">
                {userNavigation.map((item) => (
                  <MenuItem key={item.name}>
                    <NavLink to={item.to} className="block px-3 py-1 text-sm/6 text-gray-900 hover:bg-gray-50">
                      {item.name}
                    </NavLink>
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          </div>
        </div>
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
