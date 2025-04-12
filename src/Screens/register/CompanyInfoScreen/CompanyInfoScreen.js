import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native';

const CompanyInfoScreen = ({ navigation }) => {
  const [companyChoice, setCompanyChoice] = useState(null); // 'new' or 'existing'
  const [companyName, setCompanyName] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');

  const handleNext = () => {
    navigation.navigate('ConfirmationInfo');
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Informations sur l'entreprise</Text>

          <TouchableOpacity
            style={[styles.companyOption, companyChoice === 'new' && styles.selectedCompanyOption]}
            onPress={() => setCompanyChoice('new')}
          >
            <Text style={styles.companyOptionText}>Créer une nouvelle entreprise</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.companyOption, companyChoice === 'existing' && styles.selectedCompanyOption]}
            onPress={() => setCompanyChoice('existing')}
          >
            <Text style={styles.companyOptionText}>Rejoindre une entreprise existante</Text>
          </TouchableOpacity>

          {companyChoice === 'new' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nom de l'entreprise"
                value={companyName}
                onChangeText={setCompanyName}
              />
              <TextInput
                style={styles.input}
                placeholder="Numéro d'employé"
                value={employeeNumber}
                onChangeText={setEmployeeNumber}
              />
            </>
          )}

          {companyChoice === 'existing' && (
            <TextInput
              style={styles.input}
              placeholder="Numéro d'employé"
              value={employeeNumber}
              onChangeText={setEmployeeNumber}
            />
          )}

          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Suivant</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  companyOption: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedCompanyOption: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
  companyOptionText: {
    fontSize: 16,
    color: '#334155',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  nextButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#3b82f6',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CompanyInfoScreen;