export default function ProfileHeading() {
    return (
        <div className="md:flex md:items-center md:justify-between md:space-x-5">
            <div className="flex items-start space-x-5">
                <div className="shrink-0">
                    <div className="relative">
                        <img
                            alt=""
                            src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"
                            className="size-16 rounded-full"
                        />
                        <span aria-hidden="true" className="absolute inset-0 rounded-full shadow-inner" />
                    </div>
                </div>
                <div className="pt-1.5">
                    <h1 className="text-2xl font-bold text-primary-600">Ricardo Cooper</h1>
                    <p className="text-sm font-medium text-gray-500">
                        <a href="#" className="text-gray-900">
                            Front End Developer
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}
