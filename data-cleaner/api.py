from flask import Flask, request, redirect
from flask_cors import CORS, cross_origin
from numpy.core.numeric import full_like
from werkzeug.utils import secure_filename
from categorical import *
from continuous import *
import os
import json


# UPLOAD_FOLDER = 'D:\\Github Repositories\\AutoML\\data-cleaner\\notebooks\\uploads'
UPLOAD_FOLDER = 'C:\\Users\\91877\\Desktop\\AutoML\\data-cleaner\\uploads'

app = Flask(__name__)
cors = CORS(app, resources={"/*": {"origins": "*"}})
# app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route("/upload", methods=['GET', 'POST'])
@cross_origin()
def getDataset():
    print("INSIDEEEEEEEEEEEEEE")
    if request.method == 'POST':
        print("request*****************************")
        if 'file' not in request.files:
            print('no file')
            print("############################################")
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            print("(((((((((((((((((((((((((((((((((((((((((((((((")
            print('no filename')
            return redirect(request.url)
        else:
            print("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&")
            filename = secure_filename(file.filename)
            print("PATHHHH = ", os.getcwd())
            file.save(os.path.join(UPLOAD_FOLDER, filename))
            print("saved file successfully")
            continuous_processed_path, categorical_processed_path, final_encoded_path = process_data(UPLOAD_FOLDER, filename)
            return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 


@app.route("/")
def Home():
	return "Hello"

def process_data(path, filename):
    """ Function will take the uploaded csv and perform Cleaning and return the cleaned CSV """
    # Call Continuous data preprocessing
    # Call Categorical data preprocessing
    print("Preprocessing Started")
    data = ContinuousPreProcess(path+"\\"+filename)
    print("Done Preprocessing Continuous")
    data.to_csv(path+"\\"+filename.replace(".csv", "")+"_Continuous_Processed.csv", header=True, index=False)
    print("File saved")
    continuous_processed_path = path+"\\"+filename.replace(".csv", "")+"_Continuous_Processed.csv"
    categorical_processed_path, n = process_categorical(path+"\\"+filename.replace(".csv", "")+"_Continuous_Processed.csv", filename)
    print("Done Preprocessing Categorical")
    final_encoded_path = encodeData(categorical_processed_path, n)
    print("File Encoded")

    return (continuous_processed_path, categorical_processed_path, final_encoded_path)


def process_categorical(path_of_csv, filename):
    """ Function to process Categorical Data """
    
    df = pd.read_csv(path_of_csv) # reading csv file
    n = len(df.index) # getting the length of the dataset
    sr = df.isnull().sum() # finding total number of nulls in each column
    sr = sr.sort_values(ascending = False) # sorting the series in descending order of total number of nulls present in a column
    df_keys = sr.keys()

    for i in range(len(df_keys)):

        if(sr.get(key = df_keys[i])==0): break
        if(not isCategorical(df[df_keys[i]], n)): continue

        l1 = df.drop([df_keys[i]], axis = 1).dropna().index.tolist() # keeps a track of all rows which do not have any null values except df_keys[i]
        l2 = df[df[df_keys[i]].isnull()].index.tolist() # keeps a track of all null values in df_keys[i]
        l3 = [index for index in l1 if index in l2]
        to_predict = df.loc[l3]
        df_pred = predict_val(df.dropna(), df_keys[i], to_predict) # predicting the values at the null places
        df[df_keys[i]].loc[l3] = df_pred
        print(df_keys[i], df_pred)

    df = df.dropna()
    df.to_csv(path_of_csv.replace("_Continuous_Processed.csv","")+"_Categorical_Processed.csv", header=True, index=False)
    return (path_of_csv.replace("_Continuous_Processed.csv","")+"_Categorical_Processed.csv", n)


def encodeData(path_of_csv, n):
    """ Funtion to encode the CSV file with strings to one hot encoded columns """

    df = pd.read_csv(path_of_csv)
    only_str = []
    to_remove = []
    n = len(df.index)
    for i in range(len(df.columns)):
        if(type(df[df.columns[i]].iloc[0]) == str):
            only_str.append(df.columns[i])

    for i in only_str:
        if(not isCategorical(df[i],n)): 
            to_remove.append(only_str.pop(only_str.index(i)))

    df = df.drop(to_remove, axis = 1)
    column_trans_final = make_column_transformer((OneHotEncoder(handle_unknown='ignore'), only_str), remainder='passthrough')
    df = column_trans_final.fit_transform(df)
    df = pd.DataFrame(df)

    df = df.dropna()
    df.to_csv(path_of_csv.replace("_Categorical_Processed.csv", "_Final_Encoded.csv"), index=False)

    return path_of_csv.replace("_Categorical_Processed.csv", "_Final_Encoded.csv")

if __name__=='__main__':
    app.run(debug=True)
