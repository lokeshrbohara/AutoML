from flask import Flask	
app = Flask(__name__) 

from categorical import *
from continuous import *

@app.route('/')	
def process_data():
    """ Function will take the uploaded csv and perform Cleaning and return the cleaned CSV """
    # Call Continuous data preprocessing
    # Call Categorical data preprocessing
    
	return 'HELLO'


def process_categorical(path_of_csv):
    """ Function to process Categorical Data """
    
    df = pd.read_csv(path_of_csv) # reading csv file
    n = len(df.index) # getting the length of the dataset
    sr = df.isnull().sum() # finding total number of nulls in each column
    sr = sr.sort_values(ascending = False) # sorting the series in descending order of total number of nulls present in a column
    df_keys = sr.keys()

    for i in range(len(df_keys)):

        if(sr.get(key = df_keys[i])==0): break
        if(not isCategorical(df[df_keys[i]])): continue

        l1 = df.drop([df_keys[i]], axis = 1).dropna().index.tolist() # keeps a track of all rows which do not have any null values except df_keys[i]
        l2 = df[df[df_keys[i]].isnull()].index.tolist() # keeps a track of all null values in df_keys[i]
        l3 = [index for index in l1 if index in l2]
        to_predict = df.loc[l3]
        df_pred = predict_val(df.dropna(), df_keys[i], to_predict) # predicting the values at the null places
        df[df_keys[i]].loc[l3] = df_pred
        print(df_keys[i], df_pred)

    df = df.dropna()
    df.to_csv("/content/Cleaned.csv")


def encodeData(path_of_csv):
    """ Funtion to encode the CSV file with strings to one hot encoded columns """

    df = pd.read_csv(path_of_csv)
    only_str = []
    to_remove = []
    n = len(df.index)
    for i in range(len(df.columns)):
        if(type(df[df.columns[i]].iloc[0]) == str):
            only_str.append(df.columns[i])

    for i in only_str:
        if(not isCategorical(df[i])): 
            to_remove.append(only_str.pop(only_str.index(i)))

    df = df.drop(to_remove, axis = 1)
    column_trans_final = make_column_transformer((OneHotEncoder(handle_unknown='ignore'), only_str), remainder='passthrough')
    df = column_trans_final.fit_transform(df)
    df = pd.DataFrame(df)

    df = df.dropna()
    df.to_csv("/content/Encoded.csv", index=False)

if __name__=='__main__':
    app.run()
