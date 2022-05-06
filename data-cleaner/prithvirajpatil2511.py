
from tkinter import filedialog
from tkinter import *
import pickle
import evalml
import pandas as pd
import numpy as np
import os
window=Tk()
input_var=StringVar()
row=Frame(window)
row.pack(side = TOP, fill = X, padx = 5 , pady = 5)
input_label = Label(row, text = 'Enter values separated by "," \n ["onehotencoder__x0_Female","onehotencoder__x0_Male","onehotencoder__x1_Loyal Customer","onehotencoder__x1_disloyal Customer","onehotencoder__x2_Business travel","onehotencoder__x2_Personal Travel","onehotencoder__x3_Business","onehotencoder__x3_Eco","onehotencoder__x3_Eco Plus","Age","Flight Distance","Inflight wifi service","Departure/Arrival time convenient","Food and drink","Inflight service","Cleanliness","Departure Delay in Minutes","Arrival Delay in Minutes"]', font=('calibre',10, 'bold'),wraplength=500)
input_label.pack()
row=Frame(window)
row.pack(side = TOP, fill = X, padx = 10 , pady = 5)
input_entry = Entry(window,textvariable = input_var, font=('calibre',10,'normal'),justify="center",width=50)
input_entry.pack(fill = X,padx=10)
row=Frame(window)
row.pack(side = TOP, fill = X, padx = 5 , pady = 5)
output_label =Label(window,text="",font=('calibre',10, 'bold'))
output_label.pack()  
def browse_file():
    global df
    import_file_path = filedialog.askopenfilename(initialdir = os.getcwd(),filetypes=[("csv files","*.csv")])
    read_file = pd.read_csv (import_file_path)
    df = pd.DataFrame(read_file) 
    getMultipleOutput()
def getOutput():
    with open('prithvirajpatil2511.pkl' , 'rb') as f:
        model = pickle.load(f)
    temp=input_var.get().split(",")
    data=[]
    input_var.set("")
    datatypes=["float64","float64","float64","float64","float64","float64","float64","float64","float64","float64","float64","float64","float64","float64","float64","float64","float64","float64"]
    for j in range(len(datatypes)):
        if(datatypes[j]=="int64"):
            data.append(int(temp[j]))
        elif(datatypes[j]=="float64"):
            data.append(float(temp[j]))
        else:
            data.append(temp[j])
    data=[data]
    X = pd.DataFrame(data, columns =["onehotencoder__x0_Female","onehotencoder__x0_Male","onehotencoder__x1_Loyal Customer","onehotencoder__x1_disloyal Customer","onehotencoder__x2_Business travel","onehotencoder__x2_Personal Travel","onehotencoder__x3_Business","onehotencoder__x3_Eco","onehotencoder__x3_Eco Plus","Age","Flight Distance","Inflight wifi service","Departure/Arrival time convenient","Food and drink","Inflight service","Cleanliness","Departure Delay in Minutes","Arrival Delay in Minutes"])
    output_label['text']=model.predict(X).iloc[0]
def getMultipleOutput():
    with open('prithvirajpatil2511.pkl' , 'rb') as f:
        model = pickle.load(f)
    X = pd.DataFrame(df, columns =["onehotencoder__x0_Female","onehotencoder__x0_Male","onehotencoder__x1_Loyal Customer","onehotencoder__x1_disloyal Customer","onehotencoder__x2_Business travel","onehotencoder__x2_Personal Travel","onehotencoder__x3_Business","onehotencoder__x3_Eco","onehotencoder__x3_Eco Plus","Age","Flight Distance","Inflight wifi service","Departure/Arrival time convenient","Food and drink","Inflight service","Cleanliness","Departure Delay in Minutes","Arrival Delay in Minutes"])
    Y=model.predict(X)
    df['OUTPUT']=Y.to_series()
    print(df.head())
    writer = pd.ExcelWriter('demo.xlsx', engine='xlsxwriter')
    df.to_excel(writer, sheet_name='Sheet1', index=False)
    writer.save()
row=Frame(window)
row.pack(side = TOP, fill = X, padx = 5 , pady = 5)
button_singleInput = Button(window, text ="Submit", command=getOutput)
button_singleInput.pack(padx = 5, pady = 5)
row=Frame(window)
row.pack(side = TOP, fill = X, padx = 5 , pady = 5)
button_multipleInput = Button(window, text ="Upload Exelsheet", command=browse_file)
button_multipleInput.pack(padx=5,pady=5)
window.title('Sample Usage')
window.geometry("600x400+10+20")
window.mainloop()