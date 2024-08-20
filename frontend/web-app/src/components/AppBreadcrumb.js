import React from "react";
import { useLocation, Link } from "react-router-dom";
import { CBreadcrumb, CBreadcrumbItem } from "@coreui/react";
import routes from "../routes";

const AppBreadcrumb = () => {
  const currentLocation = useLocation().pathname;

  // Tìm route tương ứng với pathname
  const findRouteName = (pathname, routes) => {
    for (const route of routes) {
      if (route.path === pathname) {
        return route.name;
      }
      // Xử lý các routes con nếu có
      if (route.children) {
        const childRouteName = findRouteName(pathname, route.children);
        if (childRouteName) {
          return childRouteName;
        }
      }
    }
    return null;
  };

  const getBreadcrumbs = (location) => {
    const paths = location.split("/").filter(Boolean);
    let currentPath = "";
    return paths.map((path, index) => {
      currentPath += `/${path}`;
      const routeName = findRouteName(currentPath, routes);
      return {
        pathname: currentPath,
        name: routeName || path,
        active: index === paths.length - 1,
      };
    });
  };

  const breadcrumbs = getBreadcrumbs(currentLocation);

  return (
    <CBreadcrumb className="m-0 ms-2">
      <CBreadcrumbItem>
        <Link to="/">Home</Link>
      </CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => (
        <CBreadcrumbItem
          {...(breadcrumb.active
            ? { active: true }
            : { href: breadcrumb.pathname })}
          key={index}
        >
          {breadcrumb.active ? (
            breadcrumb.name
          ) : (
            <Link to={breadcrumb.pathname}>{breadcrumb.name}</Link>
          )}
        </CBreadcrumbItem>
      ))}
    </CBreadcrumb>
  );
};

export default React.memo(AppBreadcrumb);
