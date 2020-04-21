const CharacterService = require('../Services/CharacterService');
const CohortService = require('../Services/CohortService');

/** Gets all records from the users collection and calls a callback with the array of objects returned.
 *
 * @param db
 * @param callback
 */
function getAllUsers(db, callback) {
    let collection = db.collection('users');
    collection.find({}).toArray((err, docs) => {
        callback(docs);
    })
}

/** Takes an array of users and swaps out favChar and cohort ids for readable info from their respective
 * data sources. Inserts an objects into [favChar] and [cohort].
 *
 * @param db - Database connection
 * @param users - an array of users
 * @param callback - the callback function
 *
 * @return array - an array of users with updated data fields, or an empty array if the action fails
 */
function hydrateUsers(db, users, callback) {
    try {
        CohortService.getAllCohorts(db, (allCohorts) => {
            let allCharacters = CharacterService.getAllCharacters();
            let hydratedUsers = users.map((user) => {
                let favCharId = user.favChar;
                user.favChar = allCharacters.find(character => character.id === favCharId.toString());

                let cohortId = user.cohort;
                user.cohort = allCohorts.find(cohort => cohort._id === cohortId.toString());
                return user;
            });
            callback(hydratedUsers);
        });
    } catch (error) {
        return [];
    }
}

module.exports.getAllUsers = getAllUsers;
module.exports.hydrateUsers = hydrateUsers;