import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  Alert
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const CreateShiftScreen = ({ navigation }) => {
  const today = new Date();
  const [company, setCompany] = useState('Restaurant Le Central');
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState(new Date(today.setHours(9, 0, 0, 0)));
  const [endTime, setEndTime] = useState(new Date(today.setHours(17, 0, 0, 0)));
  const [showPicker, setShowPicker] = useState(null);
  const [colleagues, setColleagues] = useState([
    { id: 1, name: 'Alex Chen', role: 'Serveur', number: '#1234', selected: true },
    { id: 2, name: 'Sophie Lambert', role: 'Serveur', number: '#5678', selected: true },
  ]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDisplayTime = (time) => {
    return time.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handlePickerChange = (event, selectedValue) => {
    setShowPicker(null);
    if (selectedValue) {
      if (showPicker === 'date') {
        setDate(selectedValue);
      } else if (showPicker === 'start') {
        setStartTime(selectedValue);
      } else if (showPicker === 'end') {
        setEndTime(selectedValue);
      }
    }
  };

  const toggleColleagueSelection = (id) => {
    setColleagues(prev =>
      prev.map(colleague =>
        colleague.id === id ? { ...colleague, selected: !colleague.selected } : colleague
      )
    );
  };

  const handleCreateShift = () => {
    const newShift = {
      id: Date.now().toString(),
      restaurant: company,
      date: formatDisplayDate(date),
      time: `${formatDisplayTime(startTime)} - ${formatDisplayTime(endTime)}`,
      role: 'Serveur', // À adapter selon votre logique
      status: 'active',
      startTimestamp: startTime.getTime(),
      endTimestamp: endTime.getTime()
    };

    // Ici vous devriez sauvegarder le shift dans votre état global ou base de données
    Alert.alert('Shift créé', 'Votre shift a été créé avec succès!', [
      { text: 'OK', onPress: () => navigation.navigate('HomeTab', { newShift }) }
    ]);
  };

  const filteredColleagues = colleagues.filter(colleague =>
    colleague.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Créer un Shift</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurant</Text>
          <TextInput
            style={styles.input}
            value={company}
            onChangeText={setCompany}
            placeholder="Nom du restaurant"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date et Heures</Text>
          
          <TouchableOpacity 
            style={styles.card}
            onPress={() => setShowPicker('date')}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardLabel}>Date du shift</Text>
              <View style={styles.cardValueRow}>
                <Text style={styles.cardValue}>{formatDisplayDate(date)}</Text>
                {showPicker !== 'date' && <Text style={styles.cardIcon}>📅</Text>}
              </View>
            </View>
          </TouchableOpacity>

          <View style={styles.timeRow}>
            <TouchableOpacity
              style={[styles.card, styles.timeCard]}
              onPress={() => setShowPicker('start')}
            >
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Début</Text>
                <View style={styles.cardValueRow}>
                  <Text style={styles.cardValue}>{formatDisplayTime(startTime)}</Text>
                  {showPicker !== 'start' && <Text style={styles.cardIcon}>🕒</Text>}
                </View>
              </View>
            </TouchableOpacity>

            <View style={styles.timeSeparator}>
              <Text>-</Text>
            </View>

            <TouchableOpacity
              style={[styles.card, styles.timeCard]}
              onPress={() => setShowPicker('end')}
            >
              <View style={styles.cardContent}>
                <Text style={styles.cardLabel}>Fin</Text>
                <View style={styles.cardValueRow}>
                  <Text style={styles.cardValue}>{formatDisplayTime(endTime)}</Text>
                  {showPicker !== 'end' && <Text style={styles.cardIcon}>🕒</Text>}
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {showPicker && (
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={
                showPicker === 'date' ? date :
                showPicker === 'start' ? startTime : endTime
              }
              mode={showPicker === 'date' ? 'date' : 'time'}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handlePickerChange}
              locale="fr-FR"
              themeVariant="light"
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setShowPicker(null)}
              >
                <Text style={styles.pickerButtonText}>Valider</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Équipe</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.addButtonText}>+ Ajouter</Text>
            </TouchableOpacity>
          </View>
          
          {colleagues
            .filter(colleague => colleague.selected)
            .map(colleague => (
              <ColleagueCard
                key={colleague.id}
                colleague={colleague}
                onPress={() => toggleColleagueSelection(colleague.id)}
              />
            ))}
        </View>

        <TouchableOpacity 
          style={styles.createButton} 
          onPress={handleCreateShift}
        >
          <Text style={styles.createButtonText}>Créer le Shift</Text>
        </TouchableOpacity>

        <ColleaguesModal
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          colleagues={filteredColleagues}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          toggleSelection={toggleColleagueSelection}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const ColleagueCard = ({ colleague, onPress }) => (
  <TouchableOpacity style={styles.colleagueCard} onPress={onPress}>
    <View style={styles.colleagueAvatar}>
      <Text style={styles.colleagueInitials}>
        {colleague.name.split(' ').map(n => n[0]).join('')}
      </Text>
    </View>
    <View style={styles.colleagueInfo}>
      <Text style={styles.colleagueName}>{colleague.name}</Text>
      <Text style={styles.colleagueDetails}>
        {colleague.role} • {colleague.number}
      </Text>
    </View>
    <View style={[
      styles.checkbox,
      colleague.selected && styles.checkboxSelected
    ]}>
      {colleague.selected && <Text style={styles.checkmark}>✓</Text>}
    </View>
  </TouchableOpacity>
);

const ColleaguesModal = ({
  visible,
  onClose,
  colleagues,
  searchQuery,
  setSearchQuery,
  toggleSelection
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Sélection des collègues</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeIcon}>×</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
          />
        </View>

        <ScrollView style={styles.modalScrollView}>
          {colleagues.map(colleague => (
            <ColleagueCard
              key={colleague.id}
              colleague={colleague}
              onPress={() => toggleSelection(colleague.id)}
            />
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.validateButton} onPress={onClose}>
          <Text style={styles.validateButtonText}>Valider</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc'
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24
  },
  backButton: {
    fontSize: 24,
    color: '#3b82f6',
    marginRight: 16
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1e293b'
  },
  section: {
    marginBottom: 24
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b'
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontSize: 16
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  cardContent: {
    flexDirection: 'column'
  },
  cardLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8
  },
  cardValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardValue: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1e293b'
  },
  cardIcon: {
    fontSize: 20
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  timeCard: {
    flex: 1
  },
  timeSeparator: {
    paddingHorizontal: 8
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  pickerButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    alignItems: 'center'
  },
  pickerButtonText: {
    color: 'white',
    fontWeight: '600'
  },
  addButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '500'
  },
  colleagueCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  colleagueAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0f2fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  colleagueInitials: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0369a1'
  },
  colleagueInfo: {
    flex: 1
  },
  colleagueName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b'
  },
  colleagueDetails: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxSelected: {
    backgroundColor: '#3b82f6'
  },
  checkmark: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  },
  createButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end'
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    maxHeight: '80%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b'
  },
  closeIcon: {
    fontSize: 24,
    color: '#64748b'
  },
  searchContainer: {
    marginBottom: 16
  },
  searchInput: {
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    fontSize: 16
  },
  modalScrollView: {
    marginBottom: 16
  },
  validateButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center'
  },
  validateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default CreateShiftScreen;