import streamlit as st
import numpy as np
import pandas as pd
import time

st.write("尝试运用dataframe弄一个表格")
df = pd.DataFrame({
    '第一列':[1,2,3,4],
    '第二列':['a','b','c','d']})
st.table(df)
st.write("尝试运用dataframe弄一个表格---write函数")
st.write(pd.DataFrame({
    'first column': [1, 2, 3, 4],
    'second column': [10, 20, 30, 40]
}))

chart_data = pd.DataFrame(
     np.random.randn(200, 3),
     columns=['a', 'b', 'c'])
 
st.line_chart(chart_data)