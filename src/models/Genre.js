class Genre{
    id;
    deezerId;
    name;
    picture;
    pictureSmall;
    pictureMedium;
    pictureBig;
    pictureXl;

    constructor(id, deezerId, name, picture, pictureSmall, pictureMedium, pictureBig, pictureXl){
        this.id = id;
        this.deezerId = deezerId;
        this.name = name;
        this.picture = picture;
        this.pictureSmall = pictureSmall;
        this.pictureMedium = pictureMedium;
        this.pictureBig = pictureBig;
        this.pictureXl = pictureXl;
    }

    static fromJson(json){
        return new Genre(
            json.id,
            json.deezerId,
            json.name,
            json.picture,
            json.pictureSmall,
            json.pictureMedium,
            json.pictureBig,
            json.pictureXl
        );
    }

    static setId(id){
        this.id = id;
    }

    static getId(){
        return this.id;
    }

    static setDeezerId(deezerId){
        this.deezerId = deezerId;
    }

    static getDeezerId(){
        return this.deezerId;
    }

    static setName(name){
        this.name = name;
    }

    static getName(){
        return this.name;
    }

    static setPicture(picture){
        this.picture = picture;
    }

    static getPicture(){
        return this.picture;
    }

    static setPictureSmall(pictureSmall){
        this.pictureSmall = pictureSmall;
    }

    static getPictureSmall(){
        return this.pictureSmall;
    }

    static setPictureMedium(pictureMedium){
        this.pictureMedium = pictureMedium;
    }

    static getPictureMedium(){
        return this.pictureMedium;
    }

    static setPictureBig(pictureBig){
        this.pictureBig = pictureBig;
    }

    static getPictureBig(){
        return this.pictureBig;
    }   

    static setPictureXl(pictureXl){
        this.pictureXl = pictureXl;
    }

    static getPictureXl(){
        return this.pictureXl;
    }

}

export default Genre;