
listaHoras = []
listaDias  = ["L", "M", "X", "J", "V"]

print('franjasHorarias = [')
for i in range(8, 21):
    horasStr = f"\"{i}:30-{i+1}:30\","
    listaHoras.append(horasStr[1:-2])
    print( horasStr )
print('];')


print('ejemploMatrizFranjas = [')
print('// ' + '  '.join(listaDias))
for franja in listaHoras:
    print('  [1, 0, 0, 0, 1], // ' + franja)
print('];')
