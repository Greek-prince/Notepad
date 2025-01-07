const express=require('express');
const app=express();
const path=require('path');
const fs = require('fs');
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.get('/',function(req,res){
    fs.readdir(`./files`,function(err,files){//readdir basically helps us to read any type of files or directory
        res.render("index",{files:files});    
    })
    
})

app.get('/files/:filename',function(req,res){
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err, filedata){
        //readdir basically helps us to read any type of files or directory
        //if (err) {
           // return res.status(500).send("Error reading file");
        //}
        res.render("show",{filename:req.params.filename, filedata: filedata});
        //console.log(filedata);
        
        
    })
    
})
app.get('/edit/:filename',function(req,res){
    res.render('edit',{filename:req.params.filename});
   
    
})
app.post('/edit',function(req,res){
    fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}`,function(err){
        res.redirect("/");

    })
})
app.post('/create',function(req,res){//because we already declear the method is post so get is not used
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,function(err){//readdir basically helps us to read any type of files or directory
        res.redirect("/");    
    })
    
})
app.listen(3000);
//in ejs we atfirst done the background pitch black colour by zinc 900
//next we create form and tasks
//next we use fs module 
//next we create a folder and attach it with ejs
//atnext we create a loop if there is no task then no task shown if there is then some task is here added