function applyComponents(mudclient, components) {
    for (const componentName of Object.keys(components)) {
        if (/^_/.test(componentName)) {
            continue;
        }

        const component = components[componentName];

        for (const propertyName of Object.keys(component)) {
            let member = component[propertyName];

            if (typeof member === 'function') {
                member = member.bind(mudclient);
            }

            mudclient[propertyName] = member;
        }
    }
}

module.exports = applyComponents;