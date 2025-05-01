type TitleProps = {
  title: string;
  description?: string;
};

export default function Title({ title, description }: TitleProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-primary-600">{title}</h2>
      <p className="mt-1 text-sm text-gray-500">
        {description}
      </p>
    </div>
  )
}
