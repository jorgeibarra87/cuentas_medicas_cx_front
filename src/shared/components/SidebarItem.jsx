import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function SidebarItem({ item, isOpen, setOpen }) {

  const location = useLocation();

  const isActive = (ruta) => location.pathname.startsWith(ruta);

  const hasChildren = item.children && item.children.length > 0;

  // Auto-open si algún hijo está activo
  useEffect(() => {
    if (hasChildren) {
      const match = item.children.some(child =>
        location.pathname.startsWith(child.ruta || '')
      );
      if (match) setOpen(true);
    }
  }, [location.pathname]);

  return (
    <li>
      {hasChildren ? (
        <>
          <button onClick={setOpen} className="w-full text-left px-3 py-2 text-white hover:bg-gray-200" >
            {item.nombre}
          </button>
          {isOpen && (
            <ul className="list-unstyled pl-4">
              {item.children.map(child => (
                <SidebarItem key={child.nombre} item={child} />
              ))}
            </ul>
          )}
        </>
      ) : (
        <Link to={item.ruta} className={`block px-2 py-1 ${ isActive(item.ruta) ? 'bg-gray-300 font-semibold' : 'hover:bg-gray-300' }`} >
          {item.nombre}
        </Link>
      )}
    </li>
  );
}