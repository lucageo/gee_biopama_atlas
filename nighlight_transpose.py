import pandas as pd
import os
import numpy as np



# Read the CSV file
df = pd.read_csv('/Users/lucabattistella/Downloads/night/nightlights.csv')

# Aggregate duplicate entries by taking the average of 'avg_rad'
df_agg = df.groupby(['isoa3_id', 'protection', 'year'], as_index=False)['avg_rad'].mean()

# Pivot the DataFrame to transpose the data
df_transposed = df_agg.pivot(index=['isoa3_id', 'protection'], columns='year', values='avg_rad')

# Reset the index and rename the columns
df_transposed = df_transposed.reset_index().rename_axis(None, axis=1)

# Create new column names based on the years
new_columns = ['rad_' + str(col) for col in df_transposed.columns[2:]]

# Assign new column names to the DataFrame
df_transposed.columns = [df_transposed.columns[0], df_transposed.columns[1]] + new_columns

# Reset the index to build a new sequence
df_transposed.reset_index(drop=True, inplace=True)

# Fill missing values with an empty string
df_transposed.fillna('', inplace=True)

# Save the transposed data to a new CSV file
df_transposed.to_csv('/Users/lucabattistella/Downloads/night/final6.csv', index=False)
