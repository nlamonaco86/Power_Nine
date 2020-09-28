// Exercise model
module.exports = function (sequelize, DataTypes) {
    const Exercise = sequelize.define("Exercise", {
        exerName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        main: {
            type: DataTypes.STRING,
            allowNull: false
        },
        alternate: {
            type: DataTypes.STRING,
            allowNull: true
        },
        auxillary: {
            type: DataTypes.STRING,
            allowNull: true
        },
        equipment: {
            type: DataTypes.STRING,
            allowNull: false
        },
        upper: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        push: {
            type: DataTypes.BOOLEAN,
            default: false
        },
        compound: {
            type: DataTypes.BOOLEAN,
            default: false
        },
    });
    return Exercise;
};
