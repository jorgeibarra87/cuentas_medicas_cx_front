export const filtrarMenu = (menu, roles = []) => {
    return menu
        .filter(op => !op.roles || op.roles.some(r => roles.includes(r)))
        .map(op => ({
            ...op,
            submenu: op.submenu?.filter(sub => 
                !sub.roles || sub.roles.some(r => roles.includes(r))
            )
        }));
};