type HeaderProps = {
  name: string;
  className?: string;
  title?: string;
};

const Header = ({ name, className, title }: HeaderProps) => {
  return (
    <h1 className={`text-2xl font-semibold text-gray-700 ${className}`} title={title}>
      {name}
    </h1>
  );
};

export default Header;
