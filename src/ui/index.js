const bulk = require('bulk-require');

function applyUI(mudclient) {
    const components = bulk(__dirname, ['*.js']);

    for (const componentName of Object.keys(components)) {
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

module.exports = applyUI;
