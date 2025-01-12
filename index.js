const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Home route to display the list of files
app.get('/', function (req, res) {
    fs.readdir('./files', function (err, files) {
        if (err) {
            return res.status(500).send('Error reading files');
        }
        res.render("index", { files: files });
    });
});

// Route to display the content of a selected file
app.get('/files/:filename', function (req, res) {
    fs.readFile(`./files/${req.params.filename}`, 'utf-8', function (err, filedata) {
        if (err) {
            return res.status(404).send('File not found');
        }
        fs.readdir('./files', function (err, files) {
            res.render('show', {
                filename: req.params.filename,
                filedata: filedata,
                files: files // Pass the list of files to the view
            });
        });
    });
});

// Route to render the edit form for renaming or editing a task
app.get('/edit/:filename', function (req, res) {
    const filePath = `./files/${req.params.filename}`;
    fs.readFile(filePath, 'utf-8', function (err, filedata) {
        if (err) {
            return res.status(404).send('File not found');
        }
        res.render('edit', {
            filename: req.params.filename,
            description: filedata // Pass file data to description
        });
    });
});

// Route to handle renaming or updating description
app.post('/edit', function (req, res) {
    const { previous, new: newName, description } = req.body;

    const filePath = `./files/${previous}`;
    console.log(`./files/${newName}`);
    
    console.log('Trying to edit file at path:', filePath);  // Debugging line

    fs.access(filePath, fs.constants.F_OK, function (err) {
        if (err) {
            return res.status(404).send('File not found');
        }

        // Read the current file to get the content
        fs.readFile(filePath, 'utf-8', function (err, filedata) {
            if (err) {
                return res.status(404).send('Error reading the file');
            }

            // Determine if the description has changed
            let updatedContent = filedata;
            if (description) updatedContent = description;

            // If a new name is provided, rename the file
            if (newName) {
                fs.rename(filePath, `./files/${newName}`, function (err) {
                    if (err) {
                        return res.status(500).send('Error renaming the file');
                    }
                    // Write the updated content to the new file
                    fs.writeFile(`./files/${newName}`, updatedContent, function (err) {
                        if (err) {
                            return res.status(500).send('Error updating the file');
                        }
                        res.redirect('/');
                    });
                });
            } else {
                // If no new name, just update the content
                fs.writeFile(filePath, updatedContent, function (err) {
                    if (err) {
                        return res.status(500).send('Error updating the file');
                    }
                    res.redirect('/');
                });
            }
        });
    });
});

// Route to create a new file
app.post('/create', function (req, res) {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.details, function (err) {
        if (err) {
            return res.status(500).send('Error creating the file');
        }
        res.redirect("/");
    });
});

// Route to delete a file
app.post('/delete', function (req, res) {
    const fileToDelete = req.body.filename;

    fs.unlink(`./files/${fileToDelete}`, function (err) {
        if (err) {
            console.log(err);
            return res.status(500).send('Error deleting file');
        }
        res.redirect('/');
    });
});

app.listen(3000, function () {
    console.log('Server is running on port 3000');
});
