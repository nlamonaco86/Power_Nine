// Set model
// Since most of the resulting data comes from Scryfall API, this really only needs to 
// keep track of the Set name, and what user and set it belongs to.
// Sets are part of a Set, Sets are part of The Collection. Sets, Sets, belong to a User, who has only one Collection.  
module.exports = function (sequelize, DataTypes) {
    const Set = sequelize.define("Set", {
        setName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });
    // Sets belong to a User
    Set.associate = function (models) {
        Set.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };
    // Sets have many cards
    Set.associate = function (models) {
        Set.hasMany(models.Card, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Set;
};