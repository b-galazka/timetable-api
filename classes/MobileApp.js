const _ = require('lodash');

const MobileAppModel = require('../models/mobileApp');
const DatabaseObject = require('./DatabaseObject');

class MobileApp extends DatabaseObject {

    constructor({ version, changelog, message, apkFileUrl }) {

        super();

        this.data = {
            version,
            changelog,
            message,
            apkFileUrl
        };

        this.existingData = null;
    }

    save() {

        return (async () => {

            this.existingData = await MobileApp.loadData();

            if (!this.existingData) {

                return await this._createApp();
            }

            if (this._isDataProvided()) {

                return await this._updateApp();
            }
        })();
    }

    static loadData() {

        const excludedFields = {
            __v: false
        };
    
        return MobileAppModel.findOne({}, excludedFields);
    }

    _createApp() {

        const {
            version = '1.0',
            changelog = [],
            message = '',
            apkFileUrl = ''
        } = this.data;

        return MobileAppModel.create({
            version,
            changelog,
            message,
            apkFileUrl
        });
    }

    _updateApp() {

        return (async () => {

            const { existingData } = this;

            const response = {
                beforeUpdate: _.cloneDeep(existingData)
            };

            MobileApp._applyNewData(this.data, existingData);

            await existingData.save();

            response.afterUpdate = existingData;

            return response;
        })();
    }
}

module.exports = MobileApp;