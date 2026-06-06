import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Load datasets
true_df = pd.read_csv("dataset/True.csv/True.csv")
fake_df = pd.read_csv("dataset/Fake.csv/Fake.csv")

# Labels
true_df["label"] = 1
fake_df["label"] = 0

# Merge datasets
df = pd.concat([true_df, fake_df], ignore_index=True)

# Combine title and text
df["content"] = df["title"] + " " + df["text"]

# Features and labels
X = df["content"]
y = df["label"]

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

# TF-IDF Vectorizer
vectorizer = TfidfVectorizer(stop_words="english", max_df=0.7)

X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# Logistic Regression
model = LogisticRegression(max_iter=1000)

print("Training model... Please wait.")

model.fit(X_train_tfidf, y_train)

# Prediction
y_pred = model.predict(X_test_tfidf)

accuracy = accuracy_score(y_test, y_pred)

print("\nModel Accuracy:", round(accuracy * 100, 2), "%")

# Save files
joblib.dump(model, "model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")

print("\nmodel.pkl saved")
print("vectorizer.pkl saved")