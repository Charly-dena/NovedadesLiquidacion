# NovedadesLiquidacion
Dahboard de procesos que permitara la carga de novedades de liquidacion de sueldos a empleados de una o varias emperesas

Desarrollo:

Par la carga vamos a desarrollar las siguientes pantallas con estas funcionalidades

Tarea 1- Liquidaciones 

El usuario debe definir una liquidación de Haberes mediante un número o código, para que el sistema agrupe los resultados de esa liquidación con ese número.
Una liquidación puede tener los estados: abierta, y cerrada, para poder procesar una liquidación es necesario que la misma se encuentre abierta, a partir del cierre no se puede reprocesar.

Pantalla de entrada

Liquidaciones con un grid con todas las liquidaciones para ello usar el GET /idx/liq que se encuentra en el proyecto ../ApiIdeafix
Poner al comienzo de la pantalla unos filtros por empresa (combo de empresa ) ver GET de /idx/emos , filtro por liquidacion /idx/liq), Filtro por fecha de liquidacion GET /idx/liq filtrado por el campo fcieliq


Por cada fila con la liquidacion obtenida permitir consultar la misma.

Debejo del Grid permitir dad de alta una nueva liquidacion. 


Pantalla de ejemplo al consultar una liquidacion especifica

<img width="665" height="593" alt="image" src="https://github.com/user-attachments/assets/c51a4735-f594-48dd-8005-ebc83cd51348" />

Para dar de alta una liquidacion nueva tener en cuenta estos datos

Empresa:
Define cual es la empresa con la que se está trabajando. Presionando la Tecla de AYUDA se desplegará una ventana con todas las Empresas ingresadas hasta el momento.
Armar un combo usando la api /idx/emps del prooyecto ../ApiIdeafix

Condiciones especiales
Puede que en su implementación asuma un valor fijo que no puede cambiarse por pantalla. Esto se debe a la forma en que se define la variable de ambiente "Nroempresa".

Liquidación:
El número de liquidación es el valor por el cual se identifica unívocamente una liquidación. 

Condiciones especiales
No se permite modificar liquidaciones cerradas ni tampoco remover liquidaciones. No se permiten números de liquidaciones duplicados en distintas empresas.

Tipo de Liquidación:
Se indica el tipo de liquidación al que pertenece la liquidación que se está definiendo. Su valor infiere durante el proceso de liquidación en el sentido que al procesar cada concepto el liquidador verificará si tiene definido el tipo de liquidación, y realizará el cálculo solo si coinciden ambos tipos de liquidación. Si se presiona clic sobre este campo se consulta un endpoint /idx/tliq del proyecto ../ApiIdeafix

Liq. correspondiente a:
Mediante este campo se definirá en palabras a que se refiere la liquidación. Este valor aparece como referencia en los listados y procesos que impliquen liquidaciones. Además se mostrará  junto con el número de liquidación en todas las ventanas de ayuda que desplieguen liquidaciones.
    
Fecha de valor contable:
Es la fecha que se registrará en el asiento contable de la liquidación. El valor por defecto es la fecha actual.
     
Fecha de Liquidación:
Es la fecha que se tomará como fecha de realización de la liquidación. No confundir con la fecha de proceso de la liquidación. Este valor se tomará como referencia en los distintos listados legales que involucren rangos de fechas  (incluyendo los listados anuales). El valor por defecto es la fecha actual .
     
Fecha de último depósito de DNRP:
Define la fecha en que se realizó el último depósito de aportes (referente a la liquidación anterior). El valor por defecto es el día 9 (nueve) del mes y año de liquidación.

Condiciones especiales
Se verificará que el valor no sea domingo ni feriado y que sea anterior a la fecha de liquidación. 
        
Fecha de Pago:
Define el día de pago de la actual liquidación.

Condiciones especiales
La fecha de pago debe ser igual o posterior a la fecha de liquidación. 

Banco de último depósito:
Define el banco donde se depositaron los aportes en la fecha de último depósito indicada.

Ultimo mes depositado:
Define el mes al que corresponden los aportes depositados en la fecha de último depósito indicada.
    
Numera Recibos S/N?:
Este campo define si los recibos de sueldo se emiten con numeración  o no. Su efecto dependerá de la forma en que se haya definido la Emisión de recibos de sueldo papel blanco. El valor por defecto es “S”.

Permite  actualizar novedades?:
Este campo define si se le pueden hacer modificaciones a las novedades de la liquidación o  no.

Este panel debe ser accedido desde una pagina nueva. Variables y liquidaciones
A tener en cuenta para realizar validaciones segun el tipo de datos que devuelve la api de liq .

<img width="706" height="898" alt="Captura de pantalla 2025-08-06 a la(s) 11 45 15" src="https://github.com/user-attachments/assets/0b68b798-74e5-47cb-90a7-44e5a60e67e7" />





