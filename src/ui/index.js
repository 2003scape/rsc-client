const components = [
    require('./combat-style'),
    require('./inventory-tab'),
    require('./magic-tab'),
    require('./minimap-tab'),
    require('./options-tab'),
    require('./player-info-tab'),
    require('./report-dialog'),
    require('./social-dialog'),
    require('./social-tab'),
    require('./wilderness-dialog')
];

function applyUI(mudclient) {
    for (const component of components) {
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
