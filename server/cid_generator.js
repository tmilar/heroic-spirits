var cid_generator = {
    _cid: 0,
    next: function(){
        this._cid++;
        return "cid#"+this._cid;
    }
}

module.exports = cid_generator;	