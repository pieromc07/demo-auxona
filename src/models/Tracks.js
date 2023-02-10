class Track {
    
    id;
    deezerId;   
    youtubeId;
    title;
    titleShort;
    duration;
    trackPosition;
    diskNumber;
    releaseDate;
    preview;
    md5Image;
    albumName;
    artistName;
    searchable;
    artistId;
    albumId;

    constructor(id, deezerId, youtubeId, title, titleShort, duration, trackPosition, diskNumber, releaseDate, preview, md5Image,albumName, artistName, searchable, artistId, albumId) {
        this.id = id;
        this.deezerId = deezerId;
        this.youtubeId = youtubeId;
        this.title = title;
        this.titleShort = titleShort;
        this.duration = duration;
        this.trackPosition = trackPosition;
        this.diskNumber = diskNumber;
        this.releaseDate = releaseDate;
        this.preview = preview;
        this.md5Image = md5Image;
        this.albumName = albumName;
        this.artistName = artistName;
        this.searchable = searchable;
        this.artistId = artistId;
        this.albumId = albumId;
    }

    fromJson(json) {
        return new Track(
            json.id,
            json.deezer_id,
            json.youtube_id,
            json.title,
            json.title_short,
            json.duration,
            json.track_position,
            json.disk_number,
            json.release_date,
            json.preview,
            json.md5_image,
            json.album_name,
            json.artist_name,
            json.searchable,
            json.artist_id,
            json.album_id
        );
    }

    toJson() {
        return {
            id: this.deezerId,
            deezer_id: this.deezerId,
            youtube_id: this.youtubeId,
            title: this.title,
            title_short: this.titleShort,
            duration: this.duration,
            track_position: this.trackPosition,
            disk_number: this.diskNumber,
            release_date: this.releaseDate,
            preview: this.preview,
            md5_image: this.md5Image,
            album_name: this.albumName,
            artist_name: this.artistName,
            artist_id: this.artistId,
            album_id: this.albumId
        };
    }

    fromData(array) {
        const count = array.length;
        if (count === 0) {
            return null;
        }
        return array[0];
    }
    
    setId(id){
        this.id = id;
    }

    getId(){
        return this.id;
    }

    setDeezerId(deezerId){
        this.deezerId = deezerId;
    }

    getDeezerId(){
        return this.deezerId;
    }

    setYoutubeId(youtubeId){
        this.youtubeId = youtubeId;
    }

    getYoutubeId(){
        return this.youtubeId;
    }

    setTitle(title){
        this.title = title;
    }

    getTitle(){
        return this.title;
    }

    setTitleShort(titleShort){
        this.titleShort = titleShort;
    }

    getTitleShort(){
        return this.titleShort;
    }

    setDuration(duration){
        this.duration = duration;
    }

    getDuration(){
        return this.duration;
    }

    setTrackPosition(trackPosition){
        this.trackPosition = trackPosition;
    }

    getTrackPosition(){
        return this.trackPosition;
    }

    setDiskNumber(diskNumber){
        this.diskNumber = diskNumber;
    }

    getDiskNumber(){
        return this.diskNumber;
    }

    setReleaseDate(releaseDate){
        this.releaseDate = releaseDate;
    }

    getReleaseDate(){
        return this.releaseDate;
    }

    setPreview(preview){
        this.preview = preview;
    }

    getPreview(){
        return this.preview;
    }

    setMd5Image(md5Image){
        this.md5Image = md5Image;
    }

    getMd5Image(){
        return this.md5Image;
    }

    setalbumName(albumName){
        this.albumName = albumName;
    }

    getalbumName(){
        return this.albumName;
    }

    setartistName(artistName){
        this.artistName = artistName;
    }

    getartistName(){
        return this.artistName;
    }

    setArtistId(artistId){
        this.artistId = artistId;
    }

    getArtistId(){
        return this.artistId;
    }

    setAlbumId(albumId){
        this.albumId = albumId;
    }

    getAlbumId(){
        return this.albumId;
    }

}

export default Track;



