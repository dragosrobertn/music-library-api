module.exports = (connection, DataTypes) => {
    const schema = {
        name: DataTypes.STRING,
        year: DataTypes.SMALLINT,
    };

    const AlbumModel = connection.define('Album', schema);
    return AlbumModel;
};