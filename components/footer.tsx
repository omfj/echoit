export function Footer() {
  return (
    <footer className="flex items-center justify-center mt-10 w-full h-16 border-t">
      <a
        href="https://github.com/omfj"
        target="_blank"
        rel="noopener noreferrer"
      >
        &copy; {new Date().getFullYear()} omfj
      </a>
    </footer>
  );
}
