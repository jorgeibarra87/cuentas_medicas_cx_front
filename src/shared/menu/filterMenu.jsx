const normalizarRoles = (roles = []) => {
    if (Array.isArray(roles)) {
        return roles;
    }

    if (typeof roles === 'string') {
        return roles.split(',').map(role => role.trim()).filter(Boolean);
    }

    return [];
};

const filtrarItem = (item, roles) => {
    const rolesNormalizados = normalizarRoles(roles);
    const tieneAcceso = !item.roles || item.roles.some(r => rolesNormalizados.includes(r));

    if (!tieneAcceso) {
        return null;
    }

    if (!item.children || item.children.length === 0) {
        return item;
    }

    const children = item.children
        .map(child => filtrarItem(child, roles))
        .filter(Boolean);

    if (children.length === 0) {
        return null;
    }

    return {
        ...item,
        children
    };
};

export const filtrarMenu = (menu, roles = []) => {
    const rolesNormalizados = normalizarRoles(roles);

    return menu
        .map(item => filtrarItem(item, rolesNormalizados))
        .filter(Boolean);
};