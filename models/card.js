// Card model
// Since most of the resulting data comes from Scryfall API, this really only needs to 
// keep track of the card name, and what user and set it belongs to.
// Cards are part of a Set, Sets are part of The Collection. Cards and Sets belong to a User, who has only one Collection.  
module.exports = function (sequelize, DataTypes) {
    const Card = sequelize.define("Card", {
        cardName: {
            type: DataTypes.STRING,
            allowNull: false
        },
        quantity: {
            type: DataTypes.INTEGER,
            default: 1
        },
    });
    // Cards are part of a Set
    Card.associate = function (models) {
        Card.belongsTo(models.Set, {
            foreignKey: {
                allowNull: false
            }
        });
    };
    // Cards also belong to a User
    Card.associate = function (models) {
        Card.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Card;
};
