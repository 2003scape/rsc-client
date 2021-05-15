const bulk = require('bulk-require');

function applyUIComponents(mudclient) {
    const components = bulk(__dirname, ['*.js']);

    for (const [componentName, component] of Object.entries(components)) {
        if (/^_|index/.test(componentName)) {
            continue;
        }

        for (const [propertyName, member] of Object.entries(component)) {
            if (typeof member === 'function') {
                mudclient[propertyName] = member.bind(mudclient);
            } else {
                mudclient[propertyName] = member;
            }
        }
    }
}

module.exports = applyUIComponents;
