const formatPathnameAsTitle = (pathname: string) => {
  return pathname.replace(/[^a-zA-Z ]/g, " ").trim();
};

export function PathnameTitle() {
  return (
    <span className="text-xl capitalize text-gray-900 dark:text-gray-100">
      {formatPathnameAsTitle(window.location.pathname)}
    </span>
  );
}
