from flask import Flask, render_template
import os

app = Flask(__name__)
app.debug = True

@app.route('/')
def index():
    print os.getcwd()
    return render_template('index.html')

if __name__ == '__main__':
    app.run()
