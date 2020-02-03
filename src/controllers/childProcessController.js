const path = require('path');
const { exec } = require('child_process');

exports.executePHP = (req, res) => {
  exec(`php ${path.join(path.dirname(process.mainModule.filename))}/Hello.php ${req.params.name}`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
    return res.send(stdout);
  });
}

exports.executeJar = (req, res) => {
  exec(`java -jar ${path.join(path.dirname(process.mainModule.filename))}/Hello.jar ${req.params.name}`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(stdout);
    return res.send(stdout);
  });
}
