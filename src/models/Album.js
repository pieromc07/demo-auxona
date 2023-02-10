class Album{

    id;
    deezerId;
    title;
    cover;
    coverSmall;
    coverMedium;
    coverBig;
    coverXl;
    md5Image;
    nbTrack;
    artistId;
    genreId;

    constructor(id, deezerId, title, cover, coverSmall, coverMedium, coverBig, coverXl, md5Image, nbTrack, artistId, genreId){
        this.id = id;
        this.deezerId = deezerId;
        this.title = title;
        this.cover = cover;
        this.coverSmall = coverSmall;
        this.coverMedium = coverMedium;
        this.coverBig = coverBig;
        this.coverXl = coverXl;
        this.md5Image = md5Image;
        this.nbTrack = nbTrack;
        this.artistId = artistId;
        this.genreId = genreId;
    }

    static fromJson(json){
        return new Album(
            json.id,
            json.deezerId,
            json.title,
            json.cover,
            json.coverSmall,
            json.coverMedium,
            json.coverBig,
            json.coverXl,
            json.md5Image,
            json.nbTrack,
            json.artistId,
            json.genreId
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

    static setTitle(title){
        this.title = title;
    }

    static getTitle(){
        return this.title;
    }

    static setCover(cover){
        this.cover = cover;
    }

    static getCover(){
        return this.cover;
    }

    static setCoverSmall(coverSmall){
        this.coverSmall = coverSmall;
    }

    static getCoverSmall(){
        return this.coverSmall;
    }

    static setCoverMedium(coverMedium){
        this.coverMedium = coverMedium;
    }
    
    static getCoverMedium(){
        return this.coverMedium;
    }

    static setCoverBig(coverBig){
        this.coverBig = coverBig;
    }

    static getCoverBig(){
        return this.coverBig;
    }

    static setCoverXl(coverXl){
        this.coverXl = coverXl;
    }

    static getCoverXl(){
        return this.coverXl;
    }

    static setMd5Image(md5Image){
        this.md5Image = md5Image;
    }

    static getMd5Image(){
        return this.md5Image;
    }

    static setNbTrack(nbTrack){
        this.nbTrack = nbTrack;
    }

    static getNbTrack(){
        return this.nbTrack;
    }

    static setArtistId(artistId){
        this.artistId = artistId;
    }

    static getArtistId(){
        return this.artistId;
    }

    static setGenreId(genreId){
        this.genreId = genreId;
    }

    static getGenreId(){
        return this.genreId;
    }

}

export default Album;