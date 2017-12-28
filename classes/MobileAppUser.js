const _ = require('lodash');

const { oneUserUpdateRequestPer } = require('../config');
const MobileAppUserModel = require('../models/mobileAppUser');
const DatabaseObject = require('./DatabaseObject');

class MobileAppUser extends DatabaseObject {

    constructor({ phoneModel, phoneID, mostPopularTimetable, appVersion }) {

        super();

        this.data = {
            phoneModel,
            phoneID,
            mostPopularTimetable,
            appVersion,
            lastSeen: new Date().toISOString()
        };

        this.existingUser = null;
    }

    save() {

        return (async () => {

            this.existingUser = await MobileAppUser.loadUser(this.data.phoneID);

            if (!this.existingUser) {

                return await this._createUser();
            }

            if (this._isDataProvided()) {

                return await this._updateUser();
            }
        })();
    }

    static loadUser(phoneID) {

        const excludedFields = {
            __v: false
        };

        return MobileAppUserModel.findOne({ phoneID }, excludedFields);
    }

    _createUser() {

        return MobileAppUserModel.create(this.data);
    }

    _updateUser() {

        return (async () => {

            const { existingUser } = this;

            const response = {
                beforeUpdate: _.cloneDeep(existingUser)
            };

            MobileAppUser._applyNewData(this.data, existingUser);

            await existingUser.save();

            response.afterUpdate = existingUser;

            return response;
        })();
    }
}

module.exports = MobileAppUser;