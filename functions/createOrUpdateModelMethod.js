module.exports = async function createOrUpdate(data) {

    const existingRecord = await this.findOne();

    if (!existingRecord) {

        return this.create(data);
    }

    const updatedRecord = Object.assign(existingRecord, data);

    return updatedRecord.save();
};