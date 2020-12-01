var express = require('express');
var router = express.Router();
var mysql=require('mysql');
var parser=require('body-parser');
var session = require('express-session');





router.use(parser.urlencoded({extended: true}));
router.use(parser.json());
router.use(session({ secret: 'sesija', cookie: { maxAge: null }, resave: true, saveUninitialized: false, httpOnly: false}));



router.get('/login',function (req,res,next) {

    res.render('login', {title:"LOGIN"});
});
router.post('/auth', function(req, res) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'dnevnik_resursa'
    });
    var email = req.body.email;
    var sifra = req.body.sifra;
    console.log(email);
    console.log(sifra);
    if (email && sifra)
    {
        con.query('SELECT * FROM korisnik WHERE email = ? AND sifra = ?', [email, sifra], function(error, results, fields) {
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.email = email;
                var id= JSON.parse(JSON.stringify(results[0].id));
                console.log(id);

                res.redirect('/pocetna/'+ id);
            } else {
                res.send('Podaci nisu ispravni, pokusajte ponovo!');
            }
            res.end();
        });



    }
    else {
        res.send('Unesite podatke u predviđena polja!');
        res.end();
    }
});

router.get('/reg',function (req,res,next) {

    res.render('registracija', {title:"registracija"});
});
router.post('/reg',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'dnevnik_resursa'
    });
    var korisnik = {
        "ime": req.body.ime,
        "prezime": req.body.prezime,
        "email": req.body.email,
        "broj_telefona": req.body.brojtelefona,
        "datum_rodjenja": req.body.datumrodjenja,
        "sifra": req.body.sifra,
    }
    con.connect(function (err) {
        if (err) {
            res.status(500);
            return res.end(err.message);
        }
        con.query("INSERT INTO korisnik SET ?", korisnik, function (err, results, fields) {
            if (err) {
                console.log("error ocurred", err);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                });
            } else {
                if (res.status(200))
                {
                    return res.redirect('/login');
                }
                console.log('The solution is: ', results);
                res.send({
                    "code": 200,
                    "success": "USPESNO UNETI PODACI ZA KORISNIKA!"
                });

            }

        });
    });

});
router.get('/pocetna/:id',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'dnevnik_resursa'
    });
    let sql = "SELECT rezervacija.id,rezervacija.ime_predmeta,rezervacija.datum_uzimanja, korisnik.ime AS ime FROM rezervacija,korisnik WHERE rezervacija.id_korisnika = " + req.params.id + "; ";
    con.query(sql, function (err, result) {
        //console.log(result);
        res.render('pocetna', {title:"POCETNA", id:req.params.id,link:"/pocetna/"+req.params.id, link1:"/pravila/"+req.params.id, data:result});
    });

    router.get('/pravila/:id',function (req,res,next) {

        res.render('pravila', {title:"PRAVILA",id:req.params.id, link:"/pocetna/"+req.params.id, link1:"/pravila/"+req.params.id});
    });
    router.post('/opislaptopa/:id',function (req,res,next) {
        res.render('opislaptopa',{title:"OPIS LAPTOPA",id:req.params.id,link:"/pocetna/"+req.params.id});

    });
    router.post('/opisdesktopa/:id',function (req,res,next) {
        res.render('opisdesktopa',{title:"OPIS DESKTOPA",id:req.params.id,link:"/pocetna/"+req.params.id});

    });
    router.post('/opiszvucnika/:id',function (req,res,next) {
        res.render('opiszvucnika',{title:"OPIS ZVUCNIKA",id:req.params.id,link:"/pocetna/"+req.params.id});

    });
    router.post('/opisstolice/:id',function (req,res,next) {
        res.render('opisstolice',{title:"OPIS STOLICE",id:req.params.id,link:"/pocetna/"+req.params.id});

    });
    router.post('/opisstola/:id',function (req,res,next) {
        res.render('opisstola',{title:"OPIS STOLA",id:req.params.id,link:"/pocetna/"+req.params.id});

    });
    router.post('/opistv/:id',function (req,res,next) {
        res.render('opistv',{title:"OPIS TV",id:req.params.id,link:"/pocetna/"+req.params.id});

    });

});

router.get('/dnevnik',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'dnevnik_resursa'
    });
    let sql = "SELECT dnevnik.*, korisnik.ime AS ime, korisnik.id AS idkor FROM dnevnik,korisnik WHERE dnevnik.id_korisnika=korisnik.id";
    con.query(sql, function (err, result,fields) {
        console.log(result);
        res.render('dnevnik', {title:"DNEVNIK", data:result});
    });

});

router.post('/rezervisilaptop/:id',function (req,res,next) {
        const con = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            database: 'dnevnik_resursa'
        });
        let ts = Date.now();
        let date_ob = new Date(ts);
        let date = date_ob.getDate();
        let month = date_ob.getMonth() + 1;
        let year = date_ob.getFullYear();
        var predmet = {
            "ime_predmeta": "Laptop",
            "datum_uzimanja": date.toString() + "." + month.toString() + "." + year.toString() + ".",
            "id_korisnika":req.params.id,
        }
        con.connect(function (err) {
            if (err) {
                res.status(500);
                return res.end(err.message);
            }
            con.query("INSERT INTO rezervacija SET ?", predmet, function (err, results, fields) {
                if (err) {

                    console.log("error ocurred", err);
                    res.send({
                        "code": 400,
                        "baza": "Nije moguce uzeti dva puta isti predmet!"
                    });
                } else {
                    if (res.status(200))
                    {
                        return res.redirect('back');
                    }
                    console.log('The solution is: ', results);
                    res.send({
                        "code": 200,
                        "success": "USPESNO UNETI PODACI O REZERVACIJI!"
                    });

                }

            });
        });



});
router.post('/rezervisidesktop/:id',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'dnevnik_resursa'
    });
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    var predmet = {
        "ime_predmeta": "Desktop",
        "datum_uzimanja": date.toString() + "." + month.toString() + "." + year.toString() + ".",
        "id_korisnika":req.params.id,
    }
    con.connect(function (err) {
        if (err) {
            res.status(500);
            return res.end(err.message);
        }
        con.query("INSERT INTO rezervacija SET ?", predmet, function (err, results, fields) {
            if (err) {
                console.log("error ocurred", err);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                });
            } else {
                if (res.status(200))
                {
                    return res.redirect('back');
                }
                console.log('The solution is: ', results);
                res.send({
                    "code": 200,
                    "success": "USPESNO UNETI PODACI O REZERVACIJI!"
                });

            }

        });
    });

});
router.post('/rezervisispeakers/:id',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'dnevnik_resursa'
    });
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    var predmet = {
        "ime_predmeta": "Zvucnici",
        "datum_uzimanja": date.toString() + "." + month.toString() + "." + year.toString() + ".",
        "id_korisnika":req.params.id,
    }
    con.connect(function (err) {
        if (err) {
            res.status(500);
            return res.end(err.message);
        }
        con.query("INSERT INTO rezervacija SET ?", predmet, function (err, results, fields) {
            if (err) {
                console.log("error ocurred", err);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                });
            } else {
                if (res.status(200))
                {
                    return res.redirect('back');
                }
                console.log('The solution is: ', results);
                res.send({
                    "code": 200,
                    "success": "USPESNO UNETI PODACI O REZERVACIJI!"
                });

            }

        });
    });

});
router.post('/rezervisichair/:id',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'dnevnik_resursa'
    });
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    var predmet = {
        "ime_predmeta": "Stolica",
        "datum_uzimanja": date.toString() + "." + month.toString() + "." + year.toString() + ".",
        "id_korisnika":req.params.id,
    }
    con.connect(function (err) {
        if (err) {
            res.status(500);
            return res.end(err.message);
        }
        con.query("INSERT INTO rezervacija SET ?", predmet, function (err, results, fields) {
            if (err) {
                console.log("error ocurred", err);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                });
            } else {
                if (res.status(200))
                {
                    return res.redirect('back');
                }
                console.log('The solution is: ', results);
                res.send({
                    "code": 200,
                    "success": "USPESNO UNETI PODACI O REZERVACIJI!"
                });

            }

        });
    });

});
router.post('/rezervisidesk/:id',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'dnevnik_resursa'
    });
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    var predmet = {
        "ime_predmeta": "Sto",
        "datum_uzimanja": date.toString() + "." + month.toString() + "." + year.toString() + ".",
        "id_korisnika":req.params.id,
    }
    con.connect(function (err) {
        if (err) {
            res.status(500);
            return res.end(err.message);
        }
        con.query("INSERT INTO rezervacija SET ?", predmet, function (err, results, fields) {
            if (err) {
                console.log("error ocurred", err);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                });
            } else {
                if (res.status(200))
                {
                    return res.redirect('back');
                }
                console.log('The solution is: ', results);
                res.send({
                    "code": 200,
                    "success": "USPESNO UNETI PODACI O REZERVACIJI!"
                });

            }

        });
    });

});
router.post('/rezervisitv/:id',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'dnevnik_resursa'
    });
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    var predmet = {
        "ime_predmeta": "Televizor",
        "datum_uzimanja": date.toString() + "." + month.toString() + "." + year.toString() + ".",
        "id_korisnika":req.params.id,
    }
    con.connect(function (err) {
        if (err) {
            res.status(500);
            return res.end(err.message);
        }
        con.query("INSERT INTO rezervacija SET ?", predmet, function (err, results, fields) {
            if (err) {
                console.log("error ocurred", err);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                });
            } else {
                if (res.status(200))
                {
                    return res.redirect('back');
                }
                console.log('The solution is: ', results);
                res.send({
                    "code": 200,
                    "success": "USPESNO UNETI PODACI O REZERVACIJI!"
                });

            }

        });
    });

});

router.get('/obrisipredmet/:id',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'dnevnik_resursa'
    });
    let sql = "DELETE FROM rezervacija WHERE id = " + req.params.id + "; ";
    con.query(sql, function (err, results, fields) {

        if (err) {
            console.log("error ocurred", err);
            res.send({
                "code": 400,
                "failed": "error ocurred"
            })
        } else {
            return res.redirect('/dnevnik');
            console.log('The solution is: ', results);
            res.send({
                "code": 200,
                "success": "USPESNO IZBRISAN RACUN IZ BAZE!"
            });
        }
    });

});
router.get('/vratipredmet/:id',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'dnevnik_resursa'
    });
    let sql = "SELECT rezervacija.id,rezervacija.ime_predmeta,rezervacija.datum_uzimanja, korisnik.ime AS ime, korisnik.id AS idkor FROM rezervacija,korisnik WHERE rezervacija.id="+req.params.id;
    con.query(sql, function (err, result,fields) {
        console.log(result);
        var id= JSON.parse(JSON.stringify(result[0].idkor));
        console.log(id);
        res.render('pregled', {title:"PREGLED", data:result});
    });

});
router.post('/vratipredmet/:id',function (req,res,next) {
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        database: 'dnevnik_resursa'
    });
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();
    var predmet = {
        "ime_predmeta": req.body.ime_predmeta,
        "datum_uzimanja": req.body.datum_uzimanja,
        "datum_vracanja": date.toString() + "." + month.toString() + "." + year.toString() + ".",
        "id_korisnika":req.body.id_korisnika,
    }
    con.connect(function (err) {
        if (err) {
            res.status(500);
            return res.end(err.message);
        }
        con.query("INSERT INTO dnevnik SET ?", predmet, function (err, results, fields) {
            if (err) {
                console.log("error ocurred", err);
                res.send({
                    "code": 400,
                    "failed": "error ocurred"
                });
            } else {
                if (res.status(200))
                {
                    return res.redirect('/obrisipredmet/'+req.params.id);
                }
                console.log('The solution is: ', results);
                res.send({
                    "code": 200,
                    "success": "USPESNO UNETI PODACI O REZERVACIJI!"
                });

            }

        });
    });


});


module.exports = router;
