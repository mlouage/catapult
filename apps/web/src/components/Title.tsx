type TitleProps = {
  title: string;
  description?: string;
};

export default function Title({ title, description }: TitleProps) {
  return (
    <div className="pb-8">
      <h2 className="text-xl font-semibold text-primary-700">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </div>
  )
}
