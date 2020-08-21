const components = [
    require('./combat-style'),
    require('./report-abuse'),
    require('./wilderness-warning'),
    require('./player-info-tab'),
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
