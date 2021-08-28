import pandas as pd
import glob
import numpy as np
import matplotlib.pyplot as plt

def CheckUnique(data):
    col_names = data.columns.to_list()
    print("Original Column Names")
    print(col_names)
    new_col = col_names.copy()
    for i in col_names:
        if data[i].count() == len(data[i].unique()):
            isUniq = True
        else:
            isUniq = False
        if isUniq:
            print("Dropping", i)
            new_col.remove(i)
    return new_col

for i in glob.glob("./Datasets/*"):
    data = pd.read_csv(i)
    print("---------------------------------------------")
    print(i)
    col_names = CheckUnique(data)
    print(col_names)
    print("---------------------------------------------")