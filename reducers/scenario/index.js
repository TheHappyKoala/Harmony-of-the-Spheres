import { GET_SCENARIO, MODIFY_SCENARIO_PROPERTY, MODIFY_MASS_PROPERTY, ADD_MASS, DELETE_MASS } from '../../action-types/scenario';
import filterScenarios from '../../data/scenarios';
export default function (state = filterScenarios('The Sun and the Neptunian System'), action) {
    switch (action.type) {
        case GET_SCENARIO:
            return Object.assign({}, state, action.scenario);
        case MODIFY_SCENARIO_PROPERTY:
            return Object.assign({}, state, { [action.payload.key]: action.payload.value });
        case MODIFY_MASS_PROPERTY:
            return Object.assign({}, state, { masses: state.masses.map((mass) => {
                    if (mass.name === action.payload.name) {
                        return Object.assign({}, mass, { [action.payload.key]: action.payload.value });
                    }
                    return mass;
                }) });
        case ADD_MASS:
            return Object.assign({}, state, { masses: [...state.masses, action.payload] });
        case DELETE_MASS: {
            const index = state.masses
                .map((mass) => mass.name)
                .indexOf(action.name);
            const newMasses = state.masses.filter((mass, i) => index !== i);
            let newState;
            if (!newMasses.length)
                newState = Object.assign({}, state, { massBeingModified: 'There are no masses', masses: newMasses, rotatingReferenceFrame: 'Origo', cameraPosition: 'Free', cameraFocus: 'Origo' });
            else
                newState = Object.assign({}, state, { massBeingModified: newMasses[0].name, masses: newMasses, rotatingReferenceFrame: action.name !== state.rotatingReferenceFrame
                        ? state.rotatingReferenceFrame
                        : newMasses[0].name, cameraPosition: action.name !== state.cameraPosition
                        ? state.cameraPosition
                        : newMasses[0].name, cameraFocus: action.name !== state.cameraFocus
                        ? state.cameraFocus
                        : newMasses[0].name });
            return newState;
        }
        default:
            return state;
    }
}
//# sourceMappingURL=index.js.map