import os
import pandas as pd
directory = '/Users/lucabattistella/Downloads/atlas/burned_areas'
ext = ('.csv')

for filename in os.listdir(directory):
    f = os.path.join(directory, filename)
    
    if f.endswith(ext):
            
            head_tail = os.path.split(f) 
            head_tail1 = '/Users/lucabattistella/Downloads/atlas/burned_areas/out' 
            k =head_tail[1] 
            r=k.split(".")[0]
          
            p=head_tail1 + '/' + r + ' - Output.csv'

            mydata = pd.read_csv(f)
            
            new =mydata[["isoa3_id","sum"]]
            new.to_csv(p ,index=False)
